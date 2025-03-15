import { Request, Response } from "express"
import { articleModel } from "../../../schema/articleSchema.js"
import retResErrJson from "../../../utils/retResErrJson.js"
import chalk from "chalk"
import createObjectS3 from "../../../utils/S3_createObject.js"

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
    
    const createObjectS3Res = await createObjectS3(
      `${article.title}/${file.fieldname}/${file.originalname}`,
      file.buffer,
      file.mimetype
    );
    
    if(createObjectS3Res.isError){
      return retResErrJson(res,500,createObjectS3Res.message)
    }

    article.thumbnail = {
      fileName:file.originalname,
      relativePath: `${file.fieldname}/${file.originalname}`,
      mimeType: file.mimetype
    }
  }

  console.log(chalk.blueBright.bgBlack("final article to be saved: "),article)
  await article.save()

  return res.status(201).json({message:"Successfully created thumbnail"})
}

export default POST_articleThumbnail