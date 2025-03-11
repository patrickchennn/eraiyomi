import { articleModel } from "../../../schema/articleSchema.js"
import { Request,Response } from "express"
import retResErrJson from "../../../utils/retResErrJson.js"
import chalk from "chalk"

// import createObjectS3 from "../../utils/createObjectS3.js"
import S3_isObjectExist from "../../../utils/S3_isObjectExist.js"
import createObjectS3 from "../../../utils/createObjectS3.js"
import S3_deleteObject from "../../../utils/S3_deleteObject.js"
// import S3_deleteObject from "../../utils/S3_deleteObject.js"

/**
 * @desc Edit article's thumbnail
 * @endpoint PUT /api/article/:articleId
 * @access private
 */
const PUT_articleThumbnail =  async (
  req: Request<{articleId: string}>, 
  res: Response
) => {
  const {articleId} = req.params

  const {file} = req
  console.log("file=",file)

  const article = await articleModel.findById(articleId)
  if(article===null){
    return retResErrJson(res,404,"Article not found")
  }
  console.log(chalk.blueBright.bgBlack("old article.thumbnail data schema: "),article.thumbnail)



  // IF: the user did wanna change the thumbnail (by providing image...)
  if(file!==undefined){
    const newThumbnailS3Path = `${article.title}/${file.fieldname}/${file.originalname}`

    // IF: previous thumbnail already existed -->  delete the previous one first
    const isObjectExist = await S3_isObjectExist(newThumbnailS3Path)

    if(article.thumbnail !== null && isObjectExist.exists){
      const existingThumbnailS3Path = article.thumbnail.relativePath

      const S3_deleteObjectRes = await S3_deleteObject(existingThumbnailS3Path)
      console.log("S3_deleteObjectRes=",S3_deleteObjectRes)
    
      if(S3_deleteObjectRes===null){
        return retResErrJson(res,500,"Error during deleting thumbnail image")
      }
    }


    const S3_Res = await createObjectS3(
      newThumbnailS3Path,
      file.buffer, 
      file.mimetype
    );
    console.log("S3_Res=",S3_Res)

    if(S3_Res===null){
      return retResErrJson(res,500,"Error occured when trying to upload article's thumbnail image into S3")
    }

    article.thumbnail = {
      fileName:file.originalname,
      relativePath: newThumbnailS3Path,
      mimeType: file.mimetype
    }
  }

  console.log(chalk.blueBright.bgBlack("new article.thumbnail data schema: "),article.thumbnail)
  await article.save()

  return res.status(201).json({message:"Article's thumbnail successfully edited"})
}

export default PUT_articleThumbnail