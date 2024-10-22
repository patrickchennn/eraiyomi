import chalk from "chalk"
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
