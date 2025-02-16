import { Request,Response } from "express"
import { userModel } from "../../schema/userSchema.js";
import bcrypt from "bcrypt"
import generateToken from "../../utils/generateJWT.js";
import retResErrJson from "../../utils/retResErrJson.js";
import { UserLoginRequestBody } from "@shared/User.js";

/**
 * @desc login
 * @route POST /api/user/login-traditional
 * @access private
 */
export const POST_loginTraditional = async (
  req: Request<{}, {}, UserLoginRequestBody>, 
  res: Response
) => {
  const {username,email,password} = req.body;

  // IF: both username AND email does NOT exist OR password does NOT exist
  if(!username && !email || !password){
    return retResErrJson(res,401,"Please fill in the gap to login")
  }
  
  // get the user account data by either 'username' or 'email'
  const user = await userModel.findOne({ $or: [{ username }, { email }] });
  // console.log("user=",user)

  // IF: the user does not exist
  if(!user){
    return retResErrJson(res,401,`${username||email} does not exist. Please register to login.`)
  }

  // IF: the password is incorrect
  // TODO: fix the type conversion
  if(!await bcrypt.compare(password,user.password as string)){
    return retResErrJson(res,401,"Incorrect password")
  }


  const JWT_token = generateToken(user._id.toString())

  // remember user's account info
  res.cookie(
    "userCredToken",
    JSON.stringify(JWT_token),
    {
      maxAge: 3600000, // 1 hour in milliseconds
      expires:new Date(Date.now() + 1 * 3600000),
      encode: String
    }
  )

  // return res.status(200).send("succuessfully logged in")
  return res.status(200).json({
    message:"Successfully logged in",
    data:{
      _id: user._id,
      username: user.username,
      name:user.name,
      email: user.email,
      profilePictureUrl:user.profilePictureUrl,
      articleIdRef:user.articleIdRef
    }
  })
}
