import chalk from "chalk"
import { Request,Response } from "express"
import { userModel } from "../../schema/userSchema.js"

/**
 * @TODO this is not limited to only `userId` as the search param. Adding more params like `username` and `email` is for future feature
 */
export const DELETE_user = async (
  req:Request,
  res:Response
) => {
  const {userId} = req.params

  console.log(chalk.yellow(`[API] ${req.method} ${req.originalUrl}`))

  const deletedUser = await userModel.findOneAndDelete({userId})
  if(deletedUser===null){
    return res.status(404)
  }
  console.log("deletedUser=",deletedUser)
  return res.status(204).end()
}

