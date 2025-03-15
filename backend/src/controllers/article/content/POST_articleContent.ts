import { Request, Response } from "express"
import { articleModel } from "../../../schema/articleSchema.js"
import retResErrJson from "../../../utils/retResErrJson.js"
import createObjectS3 from "../../../utils/S3_createObject.js"
import chalk from "chalk"
import extractMarkdownImages from "../../../utils/extractMarkdownImages.js"

export default async function POST_articleContent(
  req: Request<{articleId: string}>, 
  res: Response

){

  const {articleId} = req.params

  const article = await articleModel.findById(articleId)
  if(article===null){
    return retResErrJson(res,404,"Article not found")
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } ?? {};
  console.log("files=",files)


  let markdownImgSyntax;


  // 1. Handle the markdown content
  if(files.content !== undefined){
    console.log(chalk.blueBright.bgBlack("Handle markdown content"))

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

  // 2. Handle the image-content (of the markdown)
  if(files['image-content'] !== undefined && markdownImgSyntax !== undefined){
    console.log(chalk.blueBright.bgBlack("Handle markdown image-content"))

    for(let i=0; i<files['image-content'].length; i++){

      const imgInput = files['image-content'][i]
      console.log("imgInput=",imgInput)

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

  console.log(chalk.blueBright.bgBlack("preview article.content:"),article.content)
  console.log(chalk.blueBright.bgBlack("preview article.imageContent:"),article.imageContent)

  await article.save()

  return res.status(201).json({message:"Successfully created article content"})
}