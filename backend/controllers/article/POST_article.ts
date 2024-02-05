import { POST_ReqBodyArticle } from "@patorikkuuu/eraiyomi-types";
import chalk from "chalk";
import mongoose from "mongoose";
import { articleModel } from "../../schema/articleSchema.js";
import { Request,Response } from "express"
import { articleAssetModel } from "../../schema/articleAssetSchema.js";
import { existsSync, mkdirSync } from "fs";
import { parentDirectory } from "../../server.js";


/**
 * @desc Create an article. All basic information are necessary to fill such as author and published date.
 * @route POST /api/article
 * @access private, login required and is an admin
 */
export const POST_article =  async (
  req: Request<{}, {}, POST_ReqBodyArticle>,
  res: Response
) => {
  console.log(chalk.yellow("[API] POST /api/article"))

  const {body} = req
  // console.log("body=",body)

  const isExist = await articleModel.findOne({"titleArticle.title":body.title})
  if(isExist){
    const msg = `title "${body.title}" was already used. Please try another title.`
    console.warn(chalk.red.bgBlack("[409]:",msg))
    return res.status(409).json({
      message: msg,
      data:isExist
    })
  }

  const articleId = new mongoose.Types.ObjectId();
  const commentsId = new mongoose.Types.ObjectId();
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
    commentsIdRef:commentsId,
    articleAssetIdRef: articleAssetId
  })
  // console.log("createdArticle=",createdArticle)

  if(createdArticle===null){
    return res.status(500).send("Error during articleModel.create(). Error during article creation")
  };

  await articleAssetModel.create({
    _id: articleAssetId,
    articleIdRef:articleId,
    thumbnail:{},
    content:[],
  })

  const articleImagesFullPath = `${parentDirectory}/article-images/${URLpathMod}`
  if(!existsSync(articleImagesFullPath)) mkdirSync(articleImagesFullPath)


  console.log(chalk.green(`[201] success creating a new article with title "${body.title}"\n`))

  return res.status(201).json({
    message:`success creating a new article with title "${body.title}"`,
    data:createdArticle
  })
}