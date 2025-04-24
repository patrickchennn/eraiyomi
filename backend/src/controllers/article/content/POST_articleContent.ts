import { Request, Response } from "express"
import { articleModel } from "../../../schema/articleSchema.js"
import retResErrJson from "../../../utils/retResErrJson.js"
import createObjectS3 from "../../../utils/S3_createObject.js"
import chalk from "chalk"
import { nanoid } from "nanoid"

/**
 * @desc Create an article content (markdown) and its assets. By "content" it means markdown text and "assets" it means such thing like images.
 * @route POST /api/article/:articleId/content
 * @access public
 */
export default async function POST_articleContent(
  req: Request<{articleId: string}>, 
  res: Response
){
  const {articleId} = req.params

  const article = await articleModel.findById(articleId)
  if(article===null){
    return retResErrJson(res,404,"Article not found")
  }

  const {body} = req
  // console.log("body=",body)

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } ?? {};
  console.log("files=",files)

  // ~~~~~~~~~~~~~~~~~~~~1. Handle the markdown content~~~~~~~~~~~~~~~~~~~~
  if(Object.hasOwn(body,"content")){
    console.log(chalk.blueBright.bgBlack("Handle markdown content"))

    const {content} = body
    console.log("content",content)

    const filename = `main-${nanoid(8)}.md`

    const createObjectS3Res = await createObjectS3(
      `${article.title}/${filename}`,
      content,
      "text/markdown"
    );

    if(createObjectS3Res.isError){
      return retResErrJson(res,500,createObjectS3Res.message)
    }

    article.content = {
      fileName:filename,
      relativePath: filename,
      mimeType: "text/markdown"
    }
  }

  // ~~~~~~~~~~~~~~~~~~~~2. Handle the image-content (of the markdown)~~~~~~~~~~~~~~~~~~~~
  if(files['image-content'] !== undefined){
    console.log(chalk.blueBright.bgBlack("Handle markdown image-content"))

    for(let i=0; i<files['image-content'].length; i++){

      const imgInput = files['image-content'][i]
      console.log("imgInput=",imgInput)

      const embeddedImgUrl = imgInput.originalname
      
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