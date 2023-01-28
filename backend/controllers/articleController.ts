import chalk from "chalk"
import {articleModel} from "../model/articleModel.js"
import { Request,Response } from "express"
import mongoose from "mongoose"
import { setDislikeComment, setLikeComment } from "../utils/setLikeDislikeComment.js"
import fresh from "fresh"
import etag from "etag"



/**
 * @desc Get all article datas
 * @route GET /api/articles
 * @access Private
 */
export const getArticles = async (req: Request, res:Response) => {
  console.log(chalk.yellow(`[API] GET /api/articles`))


  const articleDatas = await articleModel.find()
  if(articleDatas===null){
    return res.status(404).send("404 Not Found")
  }


  // check etag (caching)

  const myEtag: string = etag(JSON.stringify(articleDatas)) 

  const reqEtag = { 'if-none-match': req.headers["if-none-match"] }
  const resEtag = { 'etag': myEtag }
  // console.log(articleDatas,typeof(articleDatas))
  // console.log(reqEtag,resEtag,fresh(reqEtag, resEtag))
  if(fresh(reqEtag, resEtag)){
    return res.status(304).send("Not modifiedd")
  }

  // // console.log(myETagMod)
  res.setHeader('ETag', myEtag)
  res.set({
    "Access-Control-Expose-Headers":"Etag",
  })

  // console.log(req.headers);
  // console.log(myEtag)

  return res.status(200).json(articleDatas)
}





/**
 * @desc Get individual article with name as search param
 * @route GET /api/article/:name
 * @access Private
 */
export const getArticle = async (req: Request, res:Response) => {
  const {name} = req.params
  console.log(chalk.yellow(`[API] GET /api/article/${name}`))

  const articleData = await articleModel.findOne({titleArticle:name})
  if(articleData===null){
    return res.status(404).send("404 Not Found")
  }
  return res.status(200).json(articleData)
}






/**
 * @desc Create an article. All basic information are necessary to fill such as author and published date.
 * @route POST /api/article
 * @access Private
 */
export const postArticle =  async (req: Request, res: Response) => {
  console.log(chalk.yellow("[API] POST /api/article"))
  const {body} = req
  console.log(body)
  const articleData = await articleModel.create({
    path: body.path,
    titleArticle: body.titleArticle,
    shortDescription: body.shortDescription,
    publishedDate: body.publishedDate,
    publishedDateVerbose: body.publishedDateVerbose,
    numberOfLikes:0,
    likes:{},
    author: body.author,
    keywords: body.keywords,
    comments:{},
  })
  if(articleData===null){
    return res.status(404).send("404 Not Found")
  }
  return res.status(201).json(articleData)
}





/**
 * @desc Like an article
 * @route POST /api/article/like/:articleId
 * @access Public, login required
 */
export const putArticleLike =  async (req: Request, res: Response) => {
  const {articleId} = req.params
  const {email} = req.body

  console.log(chalk.yellow(`[API] PUT /api/article/like/:articleId`))
  if(!email.length){
    return res.status(401).send("Unauthorized")
  }else{
    // verify the gmail account (for future feature)    
  }
  const article = await articleModel.findById(articleId)
  if(article===null){
    return res.status(404).send("404 Not Found")
  }

  if(!article.likes.hasOwnProperty(email)){
    article.likes[email] = true
    article.numberOfLikes! += 1
    article.markModified("likes")
  }else{
    if(article.likes[email]){
      article.numberOfLikes! -= 1
      article.likes[email] = false
    }else{
      article.numberOfLikes! += 1
      article.likes[email] = true
    }
  } 
  article.markModified("numberOfLikes")
  article.markModified("likes")

  await article.save()
  return res.status(201).json(article)
}





/**
 * @desc delete a article
 * @route DELETE /api/article/delete/:articleId
 * @access Private
 */
export const deleteArticle =  async (req: Request, res: Response) => {
  const {articleId} = req.params
  console.log(chalk.yellow(`[API] DELETE /api/article/delete/${articleId}`))

  const deleteData = await articleModel.findByIdAndDelete(articleId)
  return res.status(200).json(deleteData)
}





// comment API
/**
 * @desc Retrieve all comments from given a particular article
 * @route GET /api/article/comments/:articleId
 * @access Public
 */
export const getComments = async (req: Request, res: Response) => {
  const {articleId} = req.params
  console.log(chalk.yellow(`[API] GET /api/article/comments/${articleId}`))
  const article = await articleModel.findById(
    {_id:articleId}
  )
  if(article===null){
    return res.status(404).send("404 Not Found")
  }

  return res.status(201).json(article.comments)

}


/**
 * @desc Any use can give a comment for any article 
 * @route POST /api/article/comment/:articleId
 * @access Public, login required
 */
export const postArticleComment =  async (req: Request, res: Response) => {
  const {articleId} = req.params
  const {body} = req
  const uniqueCommentId: string = (new mongoose.Types.ObjectId()).toString()
  const uniqueCommentIdMod: string = "comments"+"."+uniqueCommentId

  console.log(chalk.yellow(`[API] POST /api/article/comment/${articleId}`))
  console.log(body)

  const article = await articleModel.findOneAndUpdate(
    {_id:articleId},
    {
      [uniqueCommentIdMod]: {
        name: body.name,
        profilePict: body.profilePict,
        email:body.email,
        numberOfLikes: 0,
        numberOfDislikes: 0,
        likeDislikes:{},
        id: body.id,
        commentMsg: body.commentMsg,
        commentDate: (new Date()).toLocaleDateString('en-GB'),
        editDate:null,
        replies:{}
      }
    },
    {new: true}
  )

  if(article===null){
    return res.status(404).send("404 Not Found")
  }

  return res.status(201).json(article.comments)
}





/**
 * @desc Reply to a comment
 * @route POST /api/article/comment/reply/:articleId/:uniqueCommentId
 * @access Public, login required
 */
export const postCommentReply =  async (req: Request, res: Response) => {
  const {uniqueCommentId,articleId} = req.params
  const {body} = req
  const uniqueReplyId: string = (new mongoose.Types.ObjectId()).toString()

  const uniqueReplyIdMod: string = `comments.${uniqueCommentId}.replies.${uniqueReplyId}`

  console.log(chalk.yellow(`[API] POST /api/article/comment/reply/${articleId}/${uniqueCommentId}`))
  console.log(body)

  const article = await articleModel.findOneAndUpdate(
    {_id:articleId},
    {
      [uniqueReplyIdMod]:{
        name: body.name,
        profilePict: body.profilePict,
        email:body.email,
        numberOfLikes: 0,
        numberOfDislikes: 0,
        id: body.id,
        likeDislikes:{},
        replyMsg: body.replyMsg,
        replyDate: (new Date()).toLocaleDateString('en-GB'),
        editDate:null,
      }
    },
    {new: true}
  ) 


  if(article===null){
    return res.status(404).send("404 Not Found")
  }


  return res.status(201).json(article.comments)
}







/**
 * @desc update the number of the comment
 * @route PUT /api/article/comment/like-dislike/:articleId/:uniqueCommentId/?type=string&accountId=string
 * @access Public, login required
 */
export const putCommentLikeDislike =  async (req: Request, res: Response) => {
  // uniqueCommentId or uniqueReplyId, they are all the same
  const {uniqueCommentId,articleId} = req.params
  const {type,accountId} = req.query


  console.log(chalk.yellow(`[API] PUT /api/article/comment/like-dislike/${articleId}/${uniqueCommentId}/?type=${type}&accountId=${accountId}`))

  const article = await articleModel.findById(articleId)
  if(article===null){
    return res.status(404).send("404 Not Found")
  }


  // if the uniqueCommentId founded on the comments object
  if(article.comments.hasOwnProperty(uniqueCommentId)){
    // if the user want to like a comment
    if(type==="like"){
      setLikeComment(article,accountId as string, uniqueCommentId, "")
    }
    // else, the user want to dislike a comment
    else{
      setDislikeComment(article,accountId as string, uniqueCommentId, "")
    }
  }
  // else, the uniqueCommentId founded on the replies object
  else{
    // for each comments, get the uniqueCommentId
    Object.keys(article.comments).forEach(uniqueCommentId2 => {
      if(article.comments[uniqueCommentId2].replies.hasOwnProperty(uniqueCommentId)){
        if(type==="like"){
          setLikeComment(article,accountId as string, uniqueCommentId2, uniqueCommentId)
        }
        else{
          setDislikeComment(article,accountId as string, uniqueCommentId2, uniqueCommentId)
        }
      }
    })
  }

  await article.save()

  res.status(201).json(article.comments)
}





/**
 * @desc edit a comment (message)
 * @route PUT /api/article/comment/edit/:articleId/:uniqueCommentId/
 * @access Public, login required
 */
export const putCommentEdit =  async (req: Request, res: Response) => {
  const {uniqueCommentId,articleId} = req.params
  const {body} = req

  if(!body.editMsg){
    return res.status(400).send("400 Bad Request. Cannot receive a empty message (string)")
  }

  console.log(chalk.yellow(`[API] POST /api/article/comment/edit/${articleId}/${uniqueCommentId}`))
  console.log(body.editMsg)

  const article = await articleModel.findById(articleId)
  if(article===null){
    return res.status(404).send("404 Not Found")
  }

  if(article.comments.hasOwnProperty(uniqueCommentId)){
    article.comments[uniqueCommentId].commentMsg = body.editMsg

  }else{
    // console.log("shit does not exist, first")
    Object.keys(article.comments).forEach(uniqueCommentId2 => {
      if(article.comments[uniqueCommentId2].replies.hasOwnProperty(uniqueCommentId)){
        article.comments[uniqueCommentId2].replies[uniqueCommentId].replyMsg = body.editMsg
      }
    })
  }
  article.markModified(`comments.${uniqueCommentId}`)


  await article.save()

  return res.status(201).json(article.comments)
}





/**
 * @desc delete a comment (message). This function can delete both the comment and the reply message. The reply I made the structure nested inside the comment object.
 * @route DELETE /api/article/comment/delete/:articleId/:accountId/
 * @access Public, login required
 */
export const deleteComment =  async (req: Request, res: Response) => {
  const {uniqueCommentId,articleId} = req.params


  console.log(chalk.yellow(`[API] DELETE /api/article/comment/delete/${articleId}/${uniqueCommentId}`))
  const article = await articleModel.findById(articleId)
  if(article===null){
    return res.status(404).send("404 Not Found")
  }

  // if the uniqueCommentId belongs to the one of the comment object, then it means the user want to delete a comment message
  if(article.comments.hasOwnProperty(uniqueCommentId)){
    delete article.comments[uniqueCommentId]
    article.markModified(`comments.${uniqueCommentId}`)

  }else{
    // else, the uniqueCommentId is belong to reply object

    // for each comment, get the uniqueCommentId so that later we can access the comment object
    // check for each comment on the replies object, if there is an uniqueCommentId in it, then it means the user want to delete a reply message
    Object.keys(article.comments).forEach(uniqueCommentId2 => {
      if(article.comments[uniqueCommentId2].replies.hasOwnProperty(uniqueCommentId)){
        delete article.comments[uniqueCommentId2].replies[uniqueCommentId]
        article.markModified(`comments.${uniqueCommentId2}.replies.${uniqueCommentId}`)
      }
    })
  }

  await article.save()

  return res.status(200).json(article.comments)
}