import { articleModel } from "../../schema/articleSchema.js";
import { Request,Response } from "express"
import retResErrJson from "../../utils/retResErrJson.js";
import isEmpty from "lodash.isempty";
import mongoose, {  HydratedDocument } from "mongoose";
import { User } from "@shared/User.js";



/**
 * @desc Create an article
 * @endpoint POST /api/article
 * @access private, login required as an admin
 */
export const POST_article =  async (
  req: Request<
    {}, 
    {}, 
    {
      title: string
      shortDescription: string
      category: string[]
      status: "published"|"unpublished"
      totalWordCounts: string
      contentStructureType: "markdown"
      user:HydratedDocument<User>
    }
  >,
  res: Response
) => {

  const {body} = req
  console.log("body=",body)

  
  if(isEmpty(body.title) || isEmpty(body.shortDescription) || isEmpty(body.category) || isEmpty(body.status)){
    return retResErrJson(res,400,"Fill all the necessary data")
  }

  const isExist = await articleModel.findOne({title:body.title})
  if(isExist){
    return retResErrJson(res,409,`${body.title} was already used`)
  }

  const articleId = new mongoose.Types.ObjectId();

  const createdArticle = await articleModel.create({
    // User input required
    title: body.title,
    shortDescription: body.shortDescription,
    category: body.category,
    status:body.status,
    totalWordCounts: Number(body.totalWordCounts),
    contentStructureType:body.contentStructureType,
    // Server generated
    _id: articleId,
    userIdRef:body.user._id,
    publishedDate: new Date().toISOString().slice(0, 10),
    editHistory:{
      date:[]
    },
    likeDislike:{
      totalLike:0,
      totalDislike:0,
    },
  })
  console.log("createdArticle=",createdArticle)

  if(createdArticle===null){
    return retResErrJson(res,500,"Error during article creation")
  };

 

  // Update `user.articleIdRef`: it makes sense to push the newest article (id) to it because we have just created it
  body.user.articleIdRef.push(articleId.toString())
  console.log("user.articleIdRef",body.user.articleIdRef)

  // Save user document.
  await body.user.save()

  return res.status(201).json({
    message:"Article successfully created",
    data:createdArticle
  })
}