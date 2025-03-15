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

  const S3_deleteObjectRes = await S3_deleteObject(`${article.title}/${article.content.relativePath}`)

  if(S3_deleteObjectRes.isError){
    return retResErrJson(res,500,S3_deleteObjectRes.message)
  }

  // Set `article.content` field to be null
  article.set("content", null);

  // Actually saving it to db
  await article.save()

  return res.status(204).end()
}