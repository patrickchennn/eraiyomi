import chalk from "chalk";
import { Response,Request } from "express";

const errorHandler = (err: any, req: Request,res: Response, next: any) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  console.log(chalk.red(`[@errorHandler]: statusCode=${statusCode}`))

  const stack = err.stack
  console.error(chalk.red("[@errorHandler]: ",stack));
  // console.log(process.env.NODE_ENV)

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV==="development" ? stack : null
  })

  next(err)
};

export default errorHandler
