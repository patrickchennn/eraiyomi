import chalk from "chalk";
import { Request,Response } from "express"
import { ReqBodyLoginTraditional } from "@patorikkuuu/eraiyomi-types";
import { userModel } from "../../schema/userSchema.js";
import bcrypt from "bcrypt"
import generateToken from "../../utils/generateJWT.js";

/**
 * @desc login
 * @route POST /api/user/login-traditional
 * @access private
 */
export const POST_loginTraditional = async (req: Request<{}, {}, ReqBodyLoginTraditional>, res: Response) => {
  console.log(chalk.yellow(`[API] ${req.method} ${req.originalUrl}`))
  const {username,email,password} = req.body;

  // IF: both username AND email does NOT exist OR password does NOT exist
  if(!username && !email || !password){
    const msg = "Please fill in the gap to login"

    console.error(chalk.red(`[401]: ${msg}`))
    return res.status(401).json({message:msg});
  }
  
  // get the user account data by either 'username' or 'email'
  const user = await userModel.findOne({ $or: [{ username }, { email }] });
  // console.log("user=",user)

  // IF: the user does not exist
  if(!user){
    const msg = `${username||email} does not exist. Please register to login.`

    console.error(chalk.red(`[401]: ${msg}`));
    return res.status(401).json({message: msg});
  }

  // IF: the password is incorrect
  // TODO: fix the type conversion
  if(!await bcrypt.compare(password,user.password as string)){
    const msg = "Incorrect password"
    console.error(chalk.red(`[401]: ${msg}`));
    return res.status(401).json({message: msg});
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
  console.log(chalk.green(`[API]: POST /api/user/login-traditional 200; successfully logged in for "${username||email}" \n`));
  return res.status(200).json({
    message:"successfully logged in",
    _id: user._id,
    userId: user.userId,
    username: user.username,
    name:user.name,
    email: user.email,
    profilePictureUrl:user.profilePictureUrl,
  })
}
