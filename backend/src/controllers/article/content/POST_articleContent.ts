import { Request, Response } from "express"
import { articleModel } from "../../../schema/articleSchema.js"
import retResErrJson from "../../../utils/retResErrJson.js"
import createObjectS3 from "../../../utils/createObjectS3.js"
import chalk from "chalk"

export default async function POST_articleContent(
  req: Request<
    {articleId: string}, 
    {}, 
    {
      content: {
        fileName:string
        relativePath: string
        mimeType: string
      } | null
    }
  >, 
  res: Response

){

  const {articleId} = req.params

  const article = await articleModel.findById(articleId)
  if(article===null){
    return retResErrJson(res,404,"Article not found")
  }

  const {file} = req
  console.log("file=",file)

  console.log(chalk.blueBright.bgBlack("old article.thumbnail:"),article.thumbnail)


  if(file!==undefined){
    const s3Path = `${article.title}/${file.originalname}`

    const createObjectS3Res = await createObjectS3(
      s3Path,
      file.buffer,
      file.mimetype
    );
    console.log("createObjectS3Res=",createObjectS3Res)

    if(createObjectS3Res===null){
      return retResErrJson(res,500,"Error during content creation")
    }

    article.content = {
      fileName:file.originalname,
      relativePath: s3Path,
      mimeType: file.mimetype
    }
  }

  console.log(chalk.blueBright.bgBlack("new article.thumbnail to be saved:"),article.thumbnail)
  await article.save()

  return res.status(201).json({message:"Successfully created content"})
}