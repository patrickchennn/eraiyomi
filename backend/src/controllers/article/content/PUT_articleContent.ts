import { Request, Response } from "express";
import { articleModel } from "../../../schema/articleSchema.js";
import retResErrJson from "../../../utils/retResErrJson.js";
import createObjectS3 from "../../../utils/createObjectS3.js";
import S3_deleteObject from "../../../utils/S3_deleteObject.js";
import chalk from "chalk";


export default async function PUT_articleContent(req: Request, res: Response){
  const {articleId} = req.params

  const article = await articleModel.findById(articleId)
  
  if(article===null){
    return retResErrJson(res,404,`Article is not found`)
  }

  const {file} = req
  console.log("file=",file)
  console.log(chalk.blueBright.bgBlack("old article.content:"),article.content)

  if(article.content!==null){
    const existingContentS3Path = article.content.relativePath

    const S3_deleteObjectRes = await S3_deleteObject(existingContentS3Path)
  
    if(S3_deleteObjectRes===null){
      return retResErrJson(res,500,"Error during deleting old content on S3")
    }
  }


  if(file!==undefined){
    const newS3Path = `${article.title}/${file.originalname}`

    const createObjectS3Res = await createObjectS3(
      newS3Path,
      file.buffer,
      file.mimetype
    );

    if(createObjectS3Res===null){
      return retResErrJson(res,500,"Error during content creation")
    }

    article.content = {
      fileName:file.originalname,
      relativePath: newS3Path,
      mimeType: file.mimetype
    }
  }

  console.info(chalk.blueBright.bgBlack("[INF] new article.content to be saved:"),article.content)
  await article.save()

  return res.status(201).json({message:"Successfully created content"})
}