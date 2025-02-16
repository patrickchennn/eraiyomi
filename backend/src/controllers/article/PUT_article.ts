import { articleModel } from "../../schema/articleSchema.js"
import { Request,Response } from "express"
import isEmpty from "lodash.isempty"
import retResErrJson from "../../utils/retResErrJson.js"
import chalk from "chalk"
import { User } from "@shared/User.js"


/**
 * @desc Edit an article
 * @endpoint PUT /api/article/:articleId
 * @access private
 */
export const PUT_article =  async (
  req: Request<
    {articleId: string}, 
    {}, 
    {
      title?: string,
      shortDescription?: string
      category?: string[]
      status?: "published"|"unpublished"
      totalWordCounts?: number
      user: User
    }
  >, 
  res: Response
) => {
  const {articleId} = req.params

  const {body} = req
  console.log("body=",body)

  const article = await articleModel.findById(articleId)
  if(article===null){
    return retResErrJson(res,404,"Article not found")
  }


  if(!isEmpty(body)){

    body.title && (article.title = body.title)

    body.shortDescription && (article.shortDescription = body.shortDescription)
    body.category && (article.category = body.category)
    body.status && (article.status = body.status)
    body.totalWordCounts && (article.totalWordCounts = Number(body.totalWordCounts))
  }
  
  console.log(chalk.blueBright.bgBlack("final article to be saved: "),article)

  // FINALLY: save the article
  // await article.save()
  
  return res.status(201).json({message:"Article successfully edited"})
}