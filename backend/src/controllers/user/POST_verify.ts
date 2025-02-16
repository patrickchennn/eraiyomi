import { User } from "@shared/User"
import { Request,Response } from "express"


export const POST_verify = async (
  req: Request<{}, {}, {
    user: User
    token: string
  }>, 
  res: Response
) => {
  
  // console.log("req.body=",req.body)

  const {user,token} = req.body
  // console.log("user=",user)


  res.cookie(
    "userCredToken",
    JSON.stringify(token),
    {
      maxAge: 3600000, // 1 hour in milliseconds
      expires:new Date(Date.now() + 1 * 3600000),
      encode: String
    }
  )

  return res.status(200).json(user)
}