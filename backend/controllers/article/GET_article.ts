import { Request,Response } from "express"
import { articleModel } from "../../schema/articleSchema.js"
import retResErrJson from "../../utils/retResErrJson.js"

/**
 * @desc Get individual article with name as search param
 * @route GET /api/article/?id=${articleId}&title=${title}
 * @access public
 */
export const GET_article = async (req: Request, res:Response) => {
  let {id,title} = req.query
  
  const articleData = await articleModel.findOne({ 
    $or: [{ "titleArticle.URLpath":title }, { _id:id }] 
  });
  
  if(articleData===null){
    return retResErrJson(res,404,`Article with \`id=${id}\` or \`title=${title}\` is not found`)
  }

  return res.status(200).json(articleData)
}