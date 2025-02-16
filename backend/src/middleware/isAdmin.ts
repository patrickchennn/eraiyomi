import chalk from "chalk";
import { NextFunction,Request,Response } from "express";

export default function isAdmin(req: Request, res: Response, next: NextFunction){
  const {accountId}:{accountId: string} = req.body
  
  if(accountId===process.env.MY_ACCOUNT_ID){
    console.log(chalk.green.bgBlack("isAdmin()-->true"))
    next()
  }else{
    console.error(chalk.red.bgBlack(`You are not an admin: ${accountId}`))
    return res.status(401).send({
      message:`You are not an admin: ${accountId}`
    })
  }
}