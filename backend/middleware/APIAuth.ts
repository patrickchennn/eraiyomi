import chalk from "chalk";
import { NextFunction, Response, Request } from "express"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import retResErrJson from "../utils/retResErrJson.js";
dotenv.config()


// Replace this with your secret API key
const apiKey = process.env.MY_API_KEY;
// console.log("apiKey=",apiKey)

// Middleware to check for the API key in the request header
export default function APIAuth(req: Request, res: Response, next: NextFunction) {
  const providedApiKey = req.header('Authorization');
  console.log(chalk.yellow("[middleware]: @APIAuth"))
  console.log(chalk.yellow(`[middleware]: Authorizing for request: ${req.method} ${req.path}`))
  // console.log(`providedApiKey=${providedApiKey}`)
  // console.log(`apiKey=${apiKey}`)
  // console.log(providedApiKey===`Bearer ${apiKey}`)

  if (
    providedApiKey && 
    providedApiKey.startsWith("Bearer") &&
    providedApiKey === `Bearer ${apiKey}`
  ) {
    console.log(chalk.green("[middleware] 200 Authorized; API key is valid\n"))
    next()
  } else {
    const msg = `You are not allowed to do anything with: ${req.method} ${req.path}. API key is invalid`

    console.error(chalk.red(`[middleware] 403 Forbidden. ${msg}\n`))
    console.error(chalk.red(`[middleware] provided API key: ${providedApiKey}\n`))

    res.header('WWW-Authenticate', 'Bearer realm="Restricted Area"');
    res.status(403)

    return retResErrJson(res,403,msg)
  }
}