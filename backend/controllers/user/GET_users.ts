import chalk from "chalk"
import { Request,Response } from "express"
import { userModel } from "../../schema/userSchema.js"


/**
 * @desc get all users
 * @route GET /api/users
 * @access private
 */
export const GET_users = async (req:Request,res:Response) => {
  console.log(chalk.yellow(`[API] ${req.method} ${req.originalUrl}`))
  const users = await userModel.find({})
  console.log("users=",users)

  return res.status(200).json(users)
}