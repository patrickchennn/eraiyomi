import { Request,Response } from "express"
import { articleModel } from "../../schema/articleSchema.js"
import { articleAssetModel } from "../../schema/articleAssetSchema.js"
import retResErrJson from "../../utils/retResErrJson.js"
import { isValidObjectId } from "mongoose"

/**
 * @desc delete a article. If an article is delete, all mongo-document that related with `article` document is deleted, that is `article-asset`
 * @route DELETE /api/article/:articleId
 * @access Private
 */
export const DELETE_article =  async (req: Request, res: Response) => {
  const {articleId} = req.params

  const isValid = isValidObjectId(articleId)

  if(!isValid){
    return retResErrJson(res,400,`Article with \`id=${articleId}\` is an invalid id`)
  }

  const article = await articleModel.findById(articleId)
  const articleAsset = await articleAssetModel.findOne({articleIdRef:articleId})


  // console.log("article=",article)
  // console.log("articleAsset=",articleAsset)

  // IF: the article is not found
  if(!article){
    return retResErrJson(res,404,`Article with id \`${articleId}\` is not found`)

  }

  if(!articleAsset){
    return retResErrJson(res,500,`Article with id \`${articleId}\`, its asset is not found \`articleAsset=${articleAsset}\``)

  }

  await article.remove();
  await articleAsset.remove();

  return res.status(204).end()

}
