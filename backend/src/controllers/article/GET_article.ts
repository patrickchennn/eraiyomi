import { Request,Response } from "express"
import { articleModel } from "../../schema/articleSchema.js"
import retResErrJson from "../../utils/retResErrJson.js"

/**
 * @desc Get individual article
 * @endpoint GET /api/article/{articleId}
 * @access public
 */
export const GET_article = async (req: Request, res:Response) => {
  let {articleId} = req.params
  console.log("articleId=",articleId)
  
  const articleData = await articleModel.findById(articleId);
  
  if(articleData===null){
    return retResErrJson(res,404,"Article not found")
  }

  return res.status(200).json(articleData)
}