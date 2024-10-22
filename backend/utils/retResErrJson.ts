import { Response } from "express"


const retResErrJson = (res: Response, statCode: number, errMsg:string) => {
  res.locals.errorMessage = errMsg;
  return res.status(statCode).json({"message":errMsg})
}

export default retResErrJson