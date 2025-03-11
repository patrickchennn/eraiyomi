import { Request,Response } from "express"
import { articleModel } from "../../../schema/articleSchema.js"
import retResErrJson from "../../../utils/retResErrJson.js"
import getS3SignedUrl from "../../../utils/getS3SignedUrl.js"

/**
 * @desc Get article thumbnail remote URL
 * @endpoint GET /api/article/{articleId}/thumbnail
 * @access public
 */
const GET_articleThumbnail = async (req: Request, res:Response) => {
  let {articleId} = req.params

  const article = await articleModel.findById(articleId).lean()
  
  if(article===null){
    return retResErrJson(res,404,"Article not found")
  }

  if(article.thumbnail===null){
    return retResErrJson(res,400,"Thumbnail not found")
  }

  const remoteUrl = await getS3SignedUrl(article.thumbnail.relativePath)
  console.log("remoteUrl=",remoteUrl)
  
  if(remoteUrl===null){
    return retResErrJson(res,500,"Error fetching thumbnail")
  }
    

  return res.status(200).json({
    data:remoteUrl
  })
}

export default GET_articleThumbnail