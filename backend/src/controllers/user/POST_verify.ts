import { User } from "@shared/User"
import { Request,Response } from "express"


export const POST_verify = async (
  req: Request<{}, {}, {
    user: User
    token: string
  }>, 
  res: Response
) => {
  
  const {user} = req.body
  // console.log("user=",user)


  return res.status(200).json({
    message:`User "${user.username}" is verified`,
    data:user
  })
}