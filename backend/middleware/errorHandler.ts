import { Response,Request } from "express";

const errorHandler = (err: any, req: Request,res: Response, next: any) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  console.error(err.stack);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV==="development" ? err.stack : null
  })
};

export default errorHandler
