import chalk from "chalk"
import { Request,Response } from "express"
import { isValidObjectId } from "mongoose"
import { articleAssetModel } from "../../schema/articleAssetSchema.js"
import { articleModel } from "../../schema/articleSchema.js"

/**
 * @desc get an article asset
 * @route GET /api/article-asset/?id=${articleId}&title=${title}
 * @access public
 */
export const GET_articleAsset =  async (
  req: Request<{}, {}, {title: string},{id:string,title:string}>,
  res: Response
) => {
  const {id,title} = req.query

  console.log(chalk.yellow(`[API] GET /api/article-asset?id=${id}&title=${title}`))

  const isValid = isValidObjectId(id)
  // console.log("isValid=",isValid)

  if(!isValid){
    const msg = `404 Bad Request. Article with id "${id}" is not found`
    console.log(chalk.red.bgBlack(msg))
    return res.status(400).json({"message":msg})
  }

  const articleAsset = await articleAssetModel.findOne({articleIdRef:id}).lean()
  // console.log("articleAsset=",articleAsset)

  if(articleAsset===null){
    const msg = `404 Not Found. article-asset with id "${id} is not found"`
    console.log(chalk.red(msg))
    return res.status(404).json({"message":msg})
  }

  const article = await articleModel.findOne({id}, 'titleArticle.URLpath')
  // console.log("article=",article)
  
  if(article===null){
    const msg = `404 Not Found. article with id "${id} is not found"`
    console.log(chalk.red(msg))
    return res.status(404).json({"message":msg})
  }

  // TODO: handle when the external URL is fail

  console.log(chalk.green(`[API] GET /api/article-asset/?id=${id}&title=${title} 200\n`))
  return res.status(200).json(articleAsset)
}