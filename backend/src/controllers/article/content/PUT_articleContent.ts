import { Request, Response } from "express";
import { articleModel } from "../../../schema/articleSchema.js";
import retResErrJson from "../../../utils/retResErrJson.js";
import createObjectS3 from "../../../utils/createObjectS3.js";
import S3_deleteObject from "../../../utils/S3_deleteObject.js";
import chalk from "chalk";
import extractMarkdownImages from "../../../utils/extractMarkdownImages.js";


export default async function PUT_articleContent(req: Request, res: Response){
  const {articleId} = req.params

  const article = await articleModel.findById(articleId)
  
  if(article===null){
    return retResErrJson(res,404,`Article is not found`)
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } ?? {};
  console.log("files=",files)

  console.log(chalk.blueBright.bgBlack("old article.content schema:"),article.content)
  console.log(chalk.blueBright.bgBlack("old article.imageContent schema:"),article.imageContent)
  
  
  // ~~~~~~~~~~1. Handle the markdown content~~~~~~~~~~
  // Before inserting new content, we need to delete the content
  // IF: previous content already existed -->  delete the previous one first
  console.log(chalk.blueBright.bgBlack("Handle markdown content"))

  if(article.content!==null){
    const existingContentS3Path = article.content.relativePath

    const S3_deleteObjectRes = await S3_deleteObject(existingContentS3Path)

    if(S3_deleteObjectRes===null){
      return retResErrJson(res,500,"Error during deleting old content on S3")
    }
  }

  let extractedEmbeddedMarkdownImagesSytax;
  
  if(files.content !== undefined){
    
    const content = files.content[0]
    console.log("content",content)

    const markdownText = content.buffer.toString('utf-8');

    extractedEmbeddedMarkdownImagesSytax = extractMarkdownImages(markdownText)
    console.log("extractedEmbeddedMarkdownImagesSytax",extractedEmbeddedMarkdownImagesSytax)
    

    const newS3Path = `${article.title}/${content.originalname}`

    const createObjectS3Res = await createObjectS3(
      newS3Path,
      content.buffer,
      content.mimetype
    );

    if(createObjectS3Res===null){
      return retResErrJson(res,500,"Error during content creation")
    }

    article.content = {
      fileName:content.originalname,
      relativePath: newS3Path,
      mimeType: content.mimetype
    }
  }

  // ~~~~~~~~~~2. Handle the image-content (of the markdown)~~~~~~~~~~
  // Before inserting new image-content, we need to delete the previous images
  console.log(chalk.blueBright.bgBlack("Handle markdown image-content"))

  if(
    article.imageContent !== null
    && Array.isArray(article.imageContent)
  ){
    const len = article.imageContent.length
    for(let i=0; i<len; i++){
      const img = article.imageContent[i]
      // console.log("img=",img)

      const S3_deleteObjectRes = await S3_deleteObject(img.relativePath)
    
      if(S3_deleteObjectRes===null){
        return retResErrJson(res,500,"Error during deleting S3 object")
      }
    }
    for(let i=0; i<len; i++) article.imageContent.pop()
  }

  if(files['image-content'] !== undefined && extractedEmbeddedMarkdownImagesSytax !== undefined){

    for(let i=0; i<files['image-content'].length; i++){

      const img = files['image-content'][i]
      // console.log("img=",img)

      const embeddedImgUrl = decodeURIComponent(extractedEmbeddedMarkdownImagesSytax[img.originalname].url)
      
      const s3Path = `${article.title}/${embeddedImgUrl}`

      const S3_SendRes = await createObjectS3(s3Path,img.buffer,img.mimetype);
      console.log("S3_SendRes=",S3_SendRes)

      if(S3_SendRes===null){
        return retResErrJson(res,500,"Error during image content uploads")
      }

      article.imageContent.push({
        fileName: img.originalname,
        relativePath:s3Path,
        mimeType: img.mimetype,
      })
    }
  }

  console.log(chalk.blueBright.bgBlack("new article.content schema:"),article.content)
  console.log(chalk.blueBright.bgBlack("new article.imageContent schema:"),article.imageContent)

  await article.save()

  return res.status(201).json({message:"Successfully edit article"})
}