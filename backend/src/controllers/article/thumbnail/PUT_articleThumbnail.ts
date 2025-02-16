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



  // IF: the user did wanna change the thumbnail (by providing image...)
  if(file!==undefined){

    const newThumbnailS3Path = `${article.title}/${file.fieldname}/${file.originalname}`

    // IF: the thumbnail is already exist (that is the same as previous) --> skip
    const isObjectExist = await S3_isObjectExist(newThumbnailS3Path)
    if(isObjectExist.exists){
      return retResErrJson(res,500,"Error during upload thumbnail")
    }

    // ELSE: different thumbnail

    // BUT IF: previous thumbnail already existed -->  delete the previous one first
    if(article.thumbnail !== null){
      const existingThumbnailS3Path = article.thumbnail.relativePath

      const S3_deleteObjectRes = await S3_deleteObject(existingThumbnailS3Path)
      // console.log("S3_deleteObjectRes=",S3_deleteObjectRes)
    
      if(S3_deleteObjectRes===null){
        return retResErrJson(res,500,"Error during deleting thumbnail image")
      }
    }

    // AND THEN: we can actually create the object. Up until this line we have fulfilled three condition:
    // 1. If thumbnail the same --> skip
    // 2. If previously the user already inserted thumbnail --> delete the previous one --> add the new one
    // 3. If from null --> add new thumbnail
    const S3_Res = await createObjectS3(
      newThumbnailS3Path,
      file.buffer, 
      file.mimetype
    );
    // console.log("S3_Res=",S3_Res)


    if(S3_Res===null){
      return retResErrJson(res,500,"Error occured when trying to upload article's thumbnail image into S3")
    }

    article.thumbnail = {
      fileName:file.originalname,
      relativePath: newThumbnailS3Path,
      mimeType: file.mimetype
    }
  }

  console.log(chalk.blueBright.bgBlack("final article to be saved: "),article)
  await article.save()

  return res.status(201).json({message:"Article's thumbnail successfully edited"})
}

export default PUT_articleThumbnail