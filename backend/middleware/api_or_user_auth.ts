import chalk from "chalk";
import { NextFunction, Request, Response } from "express";


export default function api_or_user_auth(APIAuth:Function,authVerify:Function){
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // First, try APIAuth()
      await APIAuth(req, res);
      next(); // If APIAuth succeeds, move to the next middleware/handler
    } 
    // @ts-ignore
    catch (error1: Error) {
      console.error(chalk.red("[middleware]: @APIAuth is failed. Trying @authVerify()"))
      try {
        // Second, try authVerify()
        await authVerify(req, res);
        next(); // If APIAuth succeeds, move to the next middleware/handler

        // IF: authVerify fails --> user request is unauthorized
      } 
      // @ts-ignore
      catch (error2: Error) {
        console.error(chalk.red.bgBlack(error2))
        
        // If both APIAuth and middleware2 fail, send an error response
        return res.status(401).json({ 
          message: error2.message
        });
      }
    }
  };
}
// asdx