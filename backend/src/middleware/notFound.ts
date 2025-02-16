import { NextFunction, Request, Response } from "express";
import retResErrJson from "../utils/retResErrJson.js";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  return retResErrJson(res,404,`${req.url} is not found`)
};

export default notFound;
