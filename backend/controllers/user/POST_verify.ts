import { Request,Response } from "express"
import { User } from "@patorikkuuu/eraiyomi-types"


interface ReqBodyVerify {
  // isKeepMeLogin: boolean;
  user: User
  token: string
}
export const POST_verify = async (req: Request<{}, {}, ReqBodyVerify>, res: Response) => {
  
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