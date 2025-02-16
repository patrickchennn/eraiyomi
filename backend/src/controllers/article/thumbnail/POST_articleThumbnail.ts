import { Request, Response } from "express"
import { articleModel } from "../../../schema/articleSchema.js"
import retResErrJson from "../../../utils/retResErrJson.js"
import chalk from "chalk"
import createObjectS3 from "../../../utils/createObjectS3.js"

const POST_articleThumbnail =  async (
  req: Request<
    {articleId: string}, 
    {}, 
    {
      thumbnail: {
        fileName:string
        relativePath: string
        mimeType: string
      } | null
    }
  >, 
  res: Response
) => {
  const {articleId} = req.params

  const {file} = req
  console.log("file=",file)
  
  const article = await articleModel.findById(articleId)
  if(article===null){
    return retResErrJson(res,404,"Article not found")
  }


  if(file!==undefined){
    const s3Path = `${article.title}/${file.fieldname}/${file.originalname}`
    const createObjectS3Res = await createObjectS3(
      s3Path,
      file.buffer,
      file.mimetype
    );
    console.log("createObjectS3Res=",createObjectS3Res)

    if(createObjectS3Res===null){
      return retResErrJson(res,500,"Error during thumbnail creation")
    }

    article.thumbnail = {
      fileName:file.originalname,
      relativePath: s3Path,
      mimeType: file.mimetype
    }
  }

  console.log(chalk.blueBright.bgBlack("final article to be saved: "),article)
  await article.save()

  return res.status(201).json({message:"Successfully created thumbnail"})
}

export default POST_articleThumbnail