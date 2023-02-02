// import { Request,Response } from "express"

import chalk from "chalk";
import jwt from 'jsonwebtoken'
import { Request,Response } from "express"

const expirationToken = 30

/**
 * @desc Reply to a comment
 * @route POST /api/account/login/?verify=""
 * @access Public
 */
export const postAccountLogin = (req: Request, res: Response) => {
  const {id,picture,name,email,token} = req.body;
  const {verify} = req.query
  const data = {
    id:id,
    name,
    email,
    picture,
    isLoggedIn:true,
    token: generateToken(id),
  }
  console.log(chalk.yellow(`[API] POST /api/account/login/?verify=${verify}`))
  console.log(req.body)

  // if the user has already login before, then no need to create another cookie, just verify the JWT and the gmail account.
  if(verify==="true"){
    let decoded
    try {
      // verify the jwt
      decoded = jwt.verify(token,process.env.JWT_SECRET as string)
      // console.log(decoded)
      // verify the google account (for future feature)
    } catch (error: any) {
      data.isLoggedIn = false
      console.log(error)
      return res.status(401).send(error)
    }
    return res.status(200).json(data)
  }

  res.cookie(
    "user",
    JSON.stringify(data),
    {
      maxAge:60000*expirationToken, // 1 sec = 1000ms --> 1min=60000
      encode: String
    }
  )
  return res.status(201).json(data)
}





/**
 * @desc Generate JWT
 * @id To generate the JWT header part
 */
const generateToken = (id: string) => jwt.sign(
  {id},
  process.env.JWT_SECRET as string,
  {
    expiresIn:`${expirationToken}min`,
  }
);
