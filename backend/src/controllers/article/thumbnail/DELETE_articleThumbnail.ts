import { Request, Response } from "express"
import { articleModel } from "../../../schema/articleSchema.js"
import retResErrJson from "../../../utils/retResErrJson.js"
import S3_deleteObject from "../../../utils/S3_deleteObject.js"

const DELETE_articleThumbnail =  async (req: Request, res: Response) => {
  const {articleId} = req.params

  const article = await articleModel.findById(articleId)
  // console.log("article=",article)

  if(article===null){
    return retResErrJson(res,404,"Article not found")
  }

  const S3_deleteObjectRes = await S3_deleteObject(article.thumbnail.relativePath)
  console.log("S3_deleteObjectRes=",S3_deleteObjectRes)

  if(S3_deleteObjectRes===null){
    return retResErrJson(res,500,"Error during deleting thumbnail image")
  }

  // Set `article.thumbnail` field to be null
  article.set("thumbnail", null);

  // Check if it actually sets to null
  console.log("article.thumbnail=",article.thumbnail)

  // Actually saving it to db
  await article.save()

  return res.status(204).end()
}

export default DELETE_articleThumbnail