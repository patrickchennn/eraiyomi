import { Request,Response } from "express"
import { userModel } from "../../schema/userSchema.js"
import isEmail from 'validator/lib/isEmail.js';
import retResErrJson from "../../utils/retResErrJson.js";


/**
 * @desc get all users or individual user
 * @http_verb GET
 * @route `/api/user`
 * @full_route `/api/user?username=""|email=""`
 * @queries username: string; email=string
 * @access private
 */
export const GET_user = async (
  req:Request<{},{},{},{email?: string,username?:string}>,
  res:Response
) => {
  const {username,email} = req.query

  // IF: both email AND username do NOT exist
  if(!email && !username){
    return retResErrJson(res,400,`Email or username is not provided. Either email or username is needed`)
  }

  // IF: email exist AND the given email address format does NOT appropriate
  if(email && !isEmail(email)){
    return retResErrJson(res,400,`"${email}" is detected as not a proper email address`)
  }

  const user = await userModel.findOne({ $or: [{ username }, { email }] },"-password");
  // console.log("user=",user)

  // IF: user does NOT exist
  if(!user){
    return retResErrJson(res,404,`"${username||email}" does not exist`)
  }

  return res.status(200).json(user)
}
