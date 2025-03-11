import { Request, Response } from "express"
import { articleModel } from "../../../schema/articleSchema.js"
import retResErrJson from "../../../utils/retResErrJson.js"
import createObjectS3 from "../../../utils/createObjectS3.js"
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


  let extractedEmbeddedMarkdownImagesSytax;


  // 1. Handle the markdown content
  if(files.content !== undefined){
    console.log(chalk.blueBright.bgBlack("Handle markdown content"))

    const content = files.content[0]
    console.log("content",content)

    const markdownText = content.buffer.toString('utf-8');

    extractedEmbeddedMarkdownImagesSytax = extractMarkdownImages(markdownText)
    console.log("extractedEmbeddedMarkdownImagesSytax",extractedEmbeddedMarkdownImagesSytax)

    const s3Path = `${article.title}/${content.originalname}`

    const createObjectS3Res = await createObjectS3(
      s3Path,
      content.buffer,
      content.mimetype
    );
    console.log("createObjectS3Res=",createObjectS3Res)

    if(createObjectS3Res===null){
      return retResErrJson(res,500,"Error during content creation")
    }

    article.content = {
      fileName:content.originalname,
      relativePath: s3Path,
      mimeType: content.mimetype
    }
  }

  // 2. Handle the image-content (of the markdown)
  if(files['image-content'] !== undefined && extractedEmbeddedMarkdownImagesSytax !== undefined){
    console.log(chalk.blueBright.bgBlack("Handle markdown image-content"))

    for(let i=0; i<files['image-content'].length; i++){

      const img = files['image-content'][i]
      console.info("img=",img)

      const embeddedImgUrl = decodeURIComponent(extractedEmbeddedMarkdownImagesSytax[img.originalname].url)
      
      const s3Path = `${article.title}/${embeddedImgUrl}`
      console.log("s3Path=",s3Path)

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

  console.log(chalk.blueBright.bgBlack("preview article.content:"),article.content)
  console.log(chalk.blueBright.bgBlack("preview article.imageContent:"),article.imageContent)
  await article.save()


  return res.status(201).json({message:"Successfully created content"})
}