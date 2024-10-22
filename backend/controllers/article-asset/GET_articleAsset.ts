import { Request,Response } from "express"
import { articleAssetModel } from "../../schema/articleAssetSchema.js"
import { articleModel } from "../../schema/articleSchema.js"
import retResErrJson from "../../utils/retResErrJson.js"

/**
 * @desc get an article asset
 * @route GET /api/article-asset/?id=${articleId}}
 * @access public
 */
export const GET_articleAsset =  async (
  req: Request<{}, {}, {title: string},{id:string,title:string}>,
  res: Response
) => {
  const {id} = req.query


  const articleAsset = await articleAssetModel.findOne({articleIdRef:id}).lean()
  // console.log("articleAsset=",articleAsset)

  if(articleAsset===null){
    return retResErrJson(res,404,`article-asset with id "${id} is not found"`)
  }

  const article = await articleModel.findOne({id}, 'titleArticle.URLpath')
  // console.log("article=",article)
  
  if(article===null){
    return retResErrJson(res,500,`Article with id=${id} is not found, but article-asset is found, with id=${articleAsset._id}. It's 500 Internal Server Error because article and article-asset suppossed to be exist respectively.`)

  }

  // TODO: handle when the external URL is fail

  return res.status(200).json(articleAsset)
}
