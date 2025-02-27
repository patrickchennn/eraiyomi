import { Request,Response } from "express"
import { userModel } from "../../schema/userSchema.js"
import retResErrJson from "../../utils/retResErrJson.js";


/**
 * @desc get all users or individual user
 * @endpoint GET `/api/user?username=""|email=""`
 * @access private
 */
export const GET_user = async (
  req:Request<{},{},{},{
    email?: string,
    username?:string,
    id?:string
  }>,
  res:Response
) => {
  const {username,email,id} = req.query
  console.log("username=",username)
  console.log("email=",email)
  console.log("id=",id)

  const user = await userModel.findOne({ $or: [{ username }, { email }, {_id: id}] },"-password");
  console.log("user=",user)

  // IF: user does NOT exist
  if(!user){
    return retResErrJson(res,404,"Not found")
  }

  return res.status(200).json({
    data:user
  })
}