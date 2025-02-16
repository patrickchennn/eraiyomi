import { Request,Response } from "express"
import isEmpty from "lodash.isempty"
import createObjectS3 from "../../../utils/createObjectS3.js"
import chalk from "chalk"
import omit1stStringAfterSlash from "../../../utils/omit1stStringAfterSlash.js"
import { articleModel } from "../../../schema/articleSchema.js"
import retResErrJson from "../../../utils/retResErrJson.js"


/**
 * @desc 
 * @endpoint POST /api/article/{articleId}/image-content
 * @access private
 */
export const POST_articleImgContent = async (req: Request, res:Response) => {
  let {articleId} = req.params
  
  const articleData = await articleModel.findById(articleId);
  
  if(articleData===null){
    return retResErrJson(res,404,"Article not found")
  }

  const {files} = req
  console.log("files=",files)
  console.log("req.body=",req.body)


  const imageContentMetadata = JSON.parse(req.body['image-content'])
  console.log("imageContentMetadata=",imageContentMetadata)

  if(
    files!==undefined 
    && Array.isArray(files)
    && !isEmpty(files)
  ){

    for(let i=0; i<files.length; i++){

      const img = files[i]
      console.info("img=",img)

      let s3Path = imageContentMetadata[img.originalname]
      // Change the root directory name anything that `article.title` has
      s3Path = `${articleData.title}/${omit1stStringAfterSlash(s3Path)}`

      console.log("s3Path=",s3Path)

      const S3_SendRes = await createObjectS3(s3Path,img.buffer,img.mimetype);
      console.log("S3_SendRes=",S3_SendRes)

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


  console.log(chalk.blueBright.bgBlack("final article to be saved: "),articleData)
  await articleData.save()
  
  return res.status(201).json({message:"Successfully created image content"})
}