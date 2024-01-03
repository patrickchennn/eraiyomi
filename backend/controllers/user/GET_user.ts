import chalk from "chalk"
import { Request,Response } from "express"
import { userModel } from "../../schema/userSchema.js"
import isEmail from 'validator/lib/isEmail.js';


/**
 * @desc get all users or individual user
 * @route GET /api/user?username=""|email=""
 * @access private
 */
export const GET_user = async (
  req:Request<{},{},{},{email?: string,username?:string}>,
  res:Response
) => {
  const {username,email} = req.query
  console.log(chalk.blue(`[API] GET /api/user?username=${username}|email=${email}`))

  // IF: both email AND username do NOT exist
  if(!email && !username){
    const msg = `Either email or username is needed`
    console.error(chalk.red.bgBlack(msg))
    return res.status(400).json({message: msg})
  }

  // IF: email exist AND the given email address format does NOT appropriate
  if(email && !isEmail(email)){
    const msg = `"${email}" is detected as not a proper email address`
    console.error(chalk.red.bgBlack(msg))
    return res.status(400).json({message: msg})
  }

  const user = await userModel.findOne({ $or: [{ username }, { email }] },"-password");
  // console.log("user=",user)

  // IF: user does NOT exist
  if(!user){
    const msg = `"${username||email}" does not exist`
    console.error(chalk.red.bgBlack(msg))
    return res.status(404).json({message:msg})
  }

  return res.status(200).json(user)
}
// adssfsdf