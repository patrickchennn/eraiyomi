import { Request,Response } from "express"
import chalk from "chalk";
import isEmpty from "lodash.isempty";
import { articleModel } from "../../../schema/articleSchema.js";
import omit1stStringAfterSlash from "../../../utils/omit1stStringAfterSlash.js";
import retResErrJson from "../../../utils/retResErrJson.js";
import createObjectS3 from "../../../utils/createObjectS3.js";
import S3_deleteObject from "../../../utils/S3_deleteObject.js";

/**
 * @desc 
 * @endpoint PUT /api/article/{articleId}/image-content
 * @access private
 */
export const PUT_articleImgContent = async (req: Request, res:Response) => {
  let {articleId} = req.params
  console.log("articleId=",articleId)
  
  const articleData = await articleModel.findById(articleId);
  
  if(articleData===null){
    return retResErrJson(res,404,"Article not found")
  }

  const { files } = req
  console.log("files=",files)
  console.log("req.body=",req.body)

  const imageContentMetadata = JSON.parse(req.body['image-content'])
  console.log("imageContentMetadata=",imageContentMetadata)

  console.log(chalk.blueBright.bgBlack("old article.imageContent:"),articleData.imageContent)



  // Before inserting new image-content, we need to delete the previous images
  if(
    articleData.imageContent!==null
    && Array.isArray(articleData.imageContent)
    && !isEmpty(articleData.imageContent)
  ){
    console.log(chalk.blueBright.bgBlack("[INF] Deleting old image-content on S3"))

    for(let i=0; i<articleData.imageContent.length; i++){
      const img = articleData.imageContent[i]
      // console.log("img=",img)
      const S3_deleteObjectRes = await S3_deleteObject(img.relativePath)
    
      if(S3_deleteObjectRes===null){
        return retResErrJson(res,500,"Error during deleting S3 object")
      }
    }
    articleData.imageContent.forEach(() => articleData.imageContent.pop());
  }

  if(
    files!==undefined 
    && Array.isArray(files)
    && !isEmpty(files)
  ){
    console.log(chalk.blueBright.bgBlack("[INF] Adding new image-content on S3"))

    for(let i=0; i<files.length; i++){

      const img = files[i]
      // console.info("img=",img)

      let s3Path = imageContentMetadata[img.originalname]
      // Change the root directory name anything that `article.title` has
      s3Path = `${articleData.title}/${omit1stStringAfterSlash(s3Path)}`
      console.log("s3Path=",s3Path)

      const S3_SendRes = await createObjectS3(s3Path,img.buffer,img.mimetype);

      if(S3_SendRes===null){
        return retResErrJson(res,500,"Error during image content uploads")
      }

      articleData.imageContent.push({
        fileName: img.originalname,
        relativePath:s3Path,
        mimeType: img.mimetype,
      })
    }
  }
  console.info(chalk.blueBright.bgBlack("[INF] new article.imageContent to be saved:"),articleData.imageContent)
  await articleData.save()
  
  return res.status(201).json({message:"Successfully edited image-content"})
}
// asd