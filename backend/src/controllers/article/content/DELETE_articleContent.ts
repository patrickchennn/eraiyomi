import { Request, Response } from "express";
import { articleModel } from "../../../schema/articleSchema.js";
import retResErrJson from "../../../utils/retResErrJson.js";
import S3_deleteObject from "../../../utils/S3_deleteObject.js";


export default async function DELETE_articleContent(req: Request, res: Response){
  const {articleId} = req.params

  const article = await articleModel.findById(articleId)
  
  if(article===null){
    return retResErrJson(res,404,"Article not found")
  }

  const S3_deleteObjectRes = await S3_deleteObject(article.content.relativePath)
  // console.log("S3_deleteObjectRes=",S3_deleteObjectRes)

  if(S3_deleteObjectRes===null){
    return retResErrJson(res,500,"Error during deleting S3 object")
  }

  // Set `article.content` field to be null
  article.set("content", null);

  // Actually saving it to db
  await article.save()

  return res.status(204).end()
}