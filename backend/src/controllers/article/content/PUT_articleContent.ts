import { Request, Response } from "express";
import { articleModel } from "../../../schema/articleSchema.js";
import retResErrJson from "../../../utils/retResErrJson.js";
import createObjectS3 from "../../../utils/S3_createObject.js";
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

    const S3_deleteObjectRes = await S3_deleteObject(`${article.title}/${article.content.relativePath}`)

    if(S3_deleteObjectRes.isError){
      return retResErrJson(res,500,S3_deleteObjectRes.message)
    }
  }

  let markdownImgSyntax;
  
  if(files.content !== undefined){
    
    const content = files.content[0]
    console.log("content",content)

    const markdownText = content.buffer.toString('utf-8');

    markdownImgSyntax = extractMarkdownImages(markdownText)
    console.log("markdownImgSyntax",markdownImgSyntax)
    

    const createObjectS3Res = await createObjectS3(
      `${article.title}/${content.originalname}`,
      content.buffer,
      content.mimetype
    );

    if(createObjectS3Res.isError){
      return retResErrJson(res,500,createObjectS3Res.message)
    }

    article.content = {
      fileName:content.originalname,
      relativePath: content.originalname,
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
      const imgInput = article.imageContent[i]
      // console.log("imgInput=",imgInput)

      const S3_deleteObjectRes = await S3_deleteObject(`${article.title}/${imgInput.relativePath}`)
    
      if(S3_deleteObjectRes.isError){
        return retResErrJson(res,500,S3_deleteObjectRes.message)
      }
    }
    for(let i=0; i<len; i++) article.imageContent.pop()
  }

  if(files['image-content'] !== undefined && markdownImgSyntax !== undefined){

    for(let i=0; i<files['image-content'].length; i++){

      const imgInput = files['image-content'][i]
      // console.log("imgInput=",imgInput)

      const embeddedImgUrl = decodeURIComponent(markdownImgSyntax[imgInput.originalname].url)
      

      const createObjectS3Res = await createObjectS3(
        `${article.title}/${embeddedImgUrl}`,
        imgInput.buffer,
        imgInput.mimetype
      );
      if(createObjectS3Res.isError){
        return retResErrJson(res,500,createObjectS3Res.message)
      }

      article.imageContent.push({
        fileName: imgInput.originalname,
        relativePath:embeddedImgUrl,
        mimeType: imgInput.mimetype,
      })
    }
  }

  console.log(chalk.blueBright.bgBlack("new article.content schema:"),article.content)
  console.log(chalk.blueBright.bgBlack("new article.imageContent schema:"),article.imageContent)

  await article.save()

  return res.status(201).json({message:"Successfully edit article"})
}