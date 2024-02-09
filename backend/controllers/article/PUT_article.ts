import chalk from "chalk"
import { articleModel } from "../../schema/articleSchema.js"
import { Request,Response } from "express"
import { User } from "@patorikkuuu/eraiyomi-types"
import isEmpty from "lodash.isempty"

interface PUT_articleReqBody{
  title?: string,
  shortDescription?: string
  category?: string[]
  status?: "published"|"unpublished"
  user: User
}
/**
 * @desc Like an article
 * @route PUT /api/article/:articleId?action=like|dislike
 * @access -For like and dislike an article is public but login required. -For modifying the article.content is private
 */
export const PUT_article =  async (
  req: Request<{articleId: string}, {}, PUT_articleReqBody>, 
  res: Response
) => {
  const {articleId} = req.params
  const {action} = req.query

  console.log(chalk.yellow(`[API] PUT /api/article/${articleId}?action=${action}`))
  
  const article = await articleModel.findById(articleId)
  if(article===null){
    return res.status(404).send("404 Not Found")
  }

  // Like and dislike an article logic
  if(action && req.body.user){
    console.log("like or dislike the article section")
    const {email} = req.body.user
    let status = ""
    
    const userIdx = article.likeDislike.users.findIndex(user=>user.email===email)
    // console.log("userIdx=",userIdx)

    // IF: the user has ever like or dislike the article
    if(userIdx!==-1){
      // determine is it like(true) or dislike(false)
      const isLikeDislike: boolean = article.likeDislike.users[userIdx].statusRate!
      // console.log("isLikeDislike=",isLikeDislike)

      // IF currently the user want to like the article AND on the previous action he actually dislike it
      // basically: changing mind from dislike to like
      if(isLikeDislike===false && action==="like"){
        if(isLikeDislike===false) article.likeDislike.totalDislike -= 1
        
        article.likeDislike.totalLike += 1

        article.likeDislike.users[userIdx].statusRate=true

        status = "like"
      }
      // basically: changing mind from like to dislike
      else if(isLikeDislike===true && action==="dislike"){
        if(isLikeDislike===true) article.likeDislike.totalLike -= 1

        article.likeDislike.totalDislike += 1

        article.likeDislike.users[userIdx].statusRate=false
        status = "dislike"
      }
      // basically: changing mind from like to neutral
      else if(isLikeDislike===true && action==="like"){
        article.likeDislike.totalLike -= 1

        // remove the user from the array
        article.likeDislike.users = article.likeDislike.users.filter(user => user.email !== email)

        status = "neutralize"
      }
      // basically: changing mind from dislike to neutral
      else if(isLikeDislike===false && action==="dislike"){
        article.likeDislike.totalDislike -= 1

        // remove the user from the array
        article.likeDislike.users = article.likeDislike.users.filter(user => user.email !== email)

        status = "neutralize"
      }
    }
    // ELSE: it's the first time that the user rate this particular article
    else{
      if(action==="like"){
        article.likeDislike.totalLike += 1
        article.likeDislike.users.push({
          email,
          statusRate:true
        })
        status = "like"
      }else{
        article.likeDislike.totalDislike += 1
        article.likeDislike.users.push({
          email,
          statusRate:false
        })
        status = "dislike"
      }
    }
    article.markModified("likeDislike")

    await article.save()

    return res.status(201).json({
      message: `successfully rate ${status} article: ${article.titleArticle.title}`,
      likeDislike: article.likeDislike
    })
  }

  // console.log("body=",req.body)
  if(!isEmpty(req.body)){
    const {body} = req
    if(body.title){
      let URLpathMod = body.title.toLocaleLowerCase().split(" ").join("-")
      URLpathMod = URLpathMod.replace(/[^A-Za-z0-9-]/g, '');


      article.titleArticle.title = body.title
      article.titleArticle.URLpath = URLpathMod

      // change the article asset DIR name
    }

    body.shortDescription && (article.shortDescription = body.shortDescription)
    body.category && (article.category = body.category)
    body.status && (article.status = body.status)

    await article.save()
  }

  // console.log("updatedArticle=",article)
  
  console.log(chalk.green(`[API] PUT /api/article/${articleId}?action=${action} 201\n`))
  return res.status(201).json(article)
}
