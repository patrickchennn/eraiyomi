import chalk from "chalk";
import { NextFunction, Response, Request } from "express"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import retResErrJson from "../utils/retResErrJson.js";
import isEmpty from "lodash.isempty";
dotenv.config()


// Replace this with your secret API key
const apiKey = process.env.MY_API_KEY;
// console.log("apiKey=",apiKey)

// Middleware to check for the API key in the request header
export default function apiAuth(req: Request, res: Response, next: NextFunction) {
  console.log(chalk.blueBright.bgBlack("[middleware]: @APIAuth"))
  console.log(chalk.blueBright.bgBlack(`[middleware]: Authorizing for request: ${req.method} ${req.path}`))

  const xApiKey = req.header('x-api-key');
  console.log("xApiKey=",xApiKey)
  if(!isEmpty(xApiKey) && xApiKey===apiKey){
    console.log(chalk.green.bgBlack("[middleware] 200 Authorized. API key is valid"))
    return next()
  }

  const providedApiKey = req.header('Authorization');
  // console.log(`providedApiKey=${providedApiKey}`)

  if (
    providedApiKey && 
    providedApiKey.startsWith("Bearer") &&
    providedApiKey === `Bearer ${apiKey}`
  ) {
    console.log(chalk.green.bgBlack("[middleware] 200 Authorized. API key is valid"))
    next()
  } 
  else{
    const msg = "Invalid API key"

    console.error(chalk.red.bgBlack(`[middleware] 403 Forbidden. ${msg}`))
    console.error(chalk.red.bgBlack(`[middleware] provided API key: ${providedApiKey}\n`))

    res.header('WWW-Authenticate', 'Bearer realm="Restricted Area"');
    res.status(403)

    return retResErrJson(res,403,msg)
  }
}