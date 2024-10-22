import { POST_ReqBodyArticle } from "@patorikkuuu/eraiyomi-types";
import mongoose from "mongoose";
import { articleModel } from "../../schema/articleSchema.js";
import { Request,Response } from "express"
import { articleAssetModel } from "../../schema/articleAssetSchema.js";
import retResErrJson from "../../utils/retResErrJson.js";


/**
 * @desc Create an article. All basic information are necessary to fill such as author and published date.
 * @route POST /api/article
 * @access private, login required as an admin
 */
export const POST_article =  async (
  req: Request<{}, {}, POST_ReqBodyArticle>,
  res: Response
) => {

  const {body} = req
  // console.log("body=",body)

  const isExist = await articleModel.findOne({"titleArticle.title":body.title})
  if(isExist){

    return retResErrJson(res,409,`title \`${body.title}\` was already used. Please try another title.`)

  }

  const articleId = new mongoose.Types.ObjectId();
  const articleAssetId = new mongoose.Types.ObjectId();

  
  let URLpathMod = body.title.toLocaleLowerCase().split(" ").join("-")
  URLpathMod = URLpathMod.replace(/[^A-Za-z0-9-]/g, '');

  const createdArticle = await articleModel.create({
    _id:articleId,
    titleArticle: {
      title: body.title,
      URLpath:URLpathMod
    },
    shortDescription: body.shortDescription,
    publishedDate: new Date().toISOString().slice(0, 10),
    status:body.status,
    editHistory:{
      date:[]
    },
    likeDislike:{
      totalLike:0,
      totalDislike:0,
      users:{}
    },
    author: body.author,
    email: body.email,
    category: body.category,
    articleAssetIdRef: articleAssetId
  })
  // console.log("createdArticle=",createdArticle)

  if(createdArticle===null){
    return retResErrJson(res,500,`Error during articleModel.create(). Error during article creation`)
  };

  await articleAssetModel.create({
    _id: articleAssetId,
    articleIdRef:articleId,
    thumbnail:{},
    contentStuctureType:"",
    content:[],
    totalWordCounts:0
  })



  return res.status(201).json({
    message:`success creating a new article with title "${body.title}"`,
    data:createdArticle
  })
}