import { isValidObjectId } from "mongoose"
import retResErrJson from "../utils/retResErrJson.js"
import { NextFunction, Response, Request } from "express"

const isValidMongoId = (req: Request, res: Response, next: NextFunction) => {
  const {articleId} = req.params
  const {id} = req.query
  const {_id} = req.body

  const isValid = isValidObjectId(articleId || id || _id)

  if(!isValid){
    return retResErrJson(res,400,`Article with \`id=${articleId}\` is an invalid id.`)
  }
  next()
}

export default isValidMongoId