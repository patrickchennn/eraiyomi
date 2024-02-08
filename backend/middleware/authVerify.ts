import chalk from "chalk"
import { OAuth2Client } from "google-auth-library"
import jwt from 'jsonwebtoken'
import { NextFunction,Request,Response } from "express"
import { userModel } from "../schema/userSchema.js"



async function authVerify(
  req: Request,
  res: Response,
  next: NextFunction,
  isNext=false,
){
  console.log(chalk.yellow(`[middleware]: @authVerify`))
  console.log(chalk.yellow(`[middleware]: Authorizing for request: ${req.method} ${req.path}`))


  let token = req.headers.authorization

  // CHECK: token
  if(
    !token || !token.startsWith("Bearer")
  ){
    console.error(chalk.red("[middleware]: 401 Not authorized; no token provided\n"))
    return res.status(401).send("Not authorized. No token provided")
  }
  // console.log("token=",token)

  // remove the "Bearer" string
  token = token.split(' ')[1];
  // console.log("remove the 'bearer' token=",token)


  // IF: the token string start with char `"` AND end with char `"`, then fucking remove that shit
  if(token.startsWith('"') && token.endsWith('"')){
    token = token.slice(1, -1)
  }

  const resMsg = {
    google:{},
    traditional:{}
  }

  // TRY: traditional verification
  try {
    req.body["user"] = await tradVerify(token)
    req.body["token"] = token
    console.log(chalk.green(`[middleware]: verify user with "traditional" way is succeed.\n`))
    if(isNext) next()
    return
  } 
  // @ts-ignore
  catch (error: Error) {
    // expected output: 
    // IF: tradVerify() resulting an error -->
      // JsonWebTokenError: invalid signature
      // JsonWebTokenError: jwt malformed
      // JsonWebTokenError: invalid algorithm

    // console.error(chalk.red.bgBlack(error.stack));
    console.log(chalk.red.bgBlack(`[middleware]: verify user with "traditional" way is failed.\n`))

    console.error(chalk.red.bgBlack(error));
    resMsg.traditional = error
  }

  // TRY: Google verification
  try {
    // const data = await Gverify(token)
    // console.log(data)

    req.body.user = await Gverify(token)
    req.body["token"] = token
    console.log(chalk.green(`[middleware]: verify user with "google" is succeed.\n`))
    if(isNext) next()

    return
  } 
  // @ts-ignore
  catch (error: Error) {
    
    // expected output: 
    // IF: Gverify() --> 
      // `Error: No pem found for envelope: {"alg":"HS256","typ":"JWT"}`
    // console.error(chalk.red.bgBlack(error.stack));

    console.error(chalk.red.bgBlack(error));
    resMsg.google = error.message
  }
  if(isNext) {
    return res.status(400).json(resMsg)
  }
  throw new Error("both verification method is failed")
  // return res.status(401).json({ message: 'Unauthorized' });
}





// doc: https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
const Gverify = async (token: string) => {

  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken: token,
    // audience: decoded.aud,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    // maxExpiry:decoded.exp
  });
  // console.log("ticket=",ticket)
  
  const payload = ticket.getPayload()
  // console.log("payload=",payload)

  if(payload){
    const user = await userModel.findOne({email:payload.email}).select("-password")

    // IF the logged account, in this case google account, is not recorded/exist on the database --> save some of the data/register the account on the database
    if(user===null){
      await fetch(
        "http://localhost:8000/api/user/register",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 47bcb1c48276e0cb8fb025e03b83115fe4e45e433e1c7fca93b81cee2f343968`
          },
          body:JSON.stringify({
            username: payload.given_name,
            email: payload.email,
            name:payload.name,
            profilePictureUrl:payload.picture,
            registerationMethod:"google"
          }),
          method: 'POST',
        }
      )
    }
    // ELSE means the user has already registered before
    else{
      if(!user.profilePictureUrl && payload.picture){
        user.profilePictureUrl = payload.picture
        await user.save()
      }
    }
    // console.log("account=",account)
    return user
  }
}





const tradVerify = async (token: string) => {

  const JWT_SECRET = process.env.JWT_SECRET
  if(!JWT_SECRET) return console.error("process.env.JWT_SECRET is",JWT_SECRET)

  interface Decoded extends jwt.JwtPayload{
    id: string,
  }
  const decoded = jwt.verify(token, JWT_SECRET) as Decoded;
  // console.log("decoded=",decoded)

  // get user from the token and exclude the 'password' and '__v' field
  const user = await userModel.findById(decoded.id).select("-password -__v")
  // console.log("user=",user)

  return user
}

export default authVerify
