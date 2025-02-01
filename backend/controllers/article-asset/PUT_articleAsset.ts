import chalk from "chalk"
import { Request,Response } from "express"
import { articleAssetModel } from "../../schema/articleAssetSchema.js"
import { articleModel } from "../../schema/articleSchema.js"
import retResErrJson from "../../utils/retResErrJson.js"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { AWS_BUCKET_NAME, s3Client } from "../../index.js"
import isEmpty from "lodash.isempty"
dotenv.config()



interface ReqBodyPutArticleAsset{
  contentStructureType: "markdown" | ""
  content?:string
  totalWordCounts: number
  metadataContent:string
}
/**
 * @desc edit a particular article asset
 * @route PUT /api/article-asset/:articleId
 * @access For like and dislike an article is public but login required. For modifying the article.content is private
 */
export const PUT_articleAsset =  async (
  req: Request<{articleId: string},{},ReqBodyPutArticleAsset>, 
  res: Response
) => {
  const {articleId} = req.params
  
  
  const {body,files} = req
  console.log("body=",body)
  console.log("files=",files)


  const articleAsset = await articleAssetModel.findOne({articleIdRef:articleId})
  
  if(!articleAsset){
    return retResErrJson(res,404,`Article with id "${articleId}" is not found`)
  }

  const article = await articleModel.findOne({_id: articleId}, 'titleArticle.URLpath')
  // console.log("article=",article)

  if(article===null){
    return retResErrJson(res,500,`Article with id="${articleId} is not found, but article-asset is found, with id=${articleAsset._id}. It's 500 Internal Server Error because article and article-asset suppossed to be exist respectively.`)
  }

  if(files!==undefined){
    // if(Object.hasOwn(files, 'thumbnail')){
    //   console.info(chalk.blueBright.bgBlack("[INF] handle thumbnail image upload"))

    //   // @ts-ignore
    //   // original error: Element implicitly has an 'any' type because expression of type '"thumbnail"' can't be used to index type '{ [fieldname: string]: File[]; } | File[]'. Property 'thumbnail' does not exist on type '{ [fieldname: string]: File[]; } | File[]'.ts(7053)
    //   // TODO: fix this
    //   const thumbnail = files["thumbnail"][0]
    //   // console.log("thumbnail=",thumbnail)
    //   // console.log(Buffer.isBuffer(thumbnail.buffer))
  
  
    //   let uploadResult!: any;
    //   try {
    //     uploadResult = await new Promise((resolve) => {
    //       cloudinary.uploader.upload_stream(
    //         {
    //           use_filename:true,
    //           filename_override:"thumbnail",
    //           unique_filename:false,
    //           folder:article.titleArticle.URLpath,
    //         },
    //         (error, uploadResult) => {
    //           return resolve(uploadResult);
    //         }).end(thumbnail.buffer);
    //     });
    //     // console.log("uploadResult=",uploadResult)
    //   } 
    //   // @ts-ignore
    //   catch (error: UploadApiErrorResponse) {
    //     return retResErrJson(res,500,error)
    //   }
  
    //   const thumbnailTemp = {
    //     fieldName: thumbnail.fieldname,
    //     originalname: thumbnail.originalname,
    //     encoding: thumbnail.encoding,
    //     mimetype: thumbnail.mimetype,
    //     filename: thumbnail.originalname,
    //     size: thumbnail.size,
    //     dataURL: uploadResult.secure_url,
    //   }
    //   articleAsset.thumbnail = thumbnailTemp
    // }

    let metadata;
    if ('content' in files && Array.isArray(files.content)) {
      console.info(chalk.blueBright.bgBlack("[INF] handle Markdown upload"))
      articleAsset.content = []
  
      for(let i=0; i<files.content.length; i++){
        interface ExtendedFile extends Express.Multer.File {
          webkitRelativePath?: string
        }
        const file: ExtendedFile = files['content'][i]
        // console.info("file=",file)
  
        // Parse the metadata JSON
        try {
          metadata = JSON.parse(body.metadataContent);
        } catch (error) {
          console.error("Error parsing metadata JSON:", error);
          metadata = [];
        }
  
        // Link each file to its corresponding metadata
        const fileMetadata = metadata[i];
        if (fileMetadata) {
          file.webkitRelativePath = fileMetadata.webkitRelativePath
        }
  
        
        // Here is where the logic of storing assets happen
        const cmd = new PutObjectCommand({
          Bucket: AWS_BUCKET_NAME,
          Key: file.webkitRelativePath,
          Body: file.buffer,
          ContentType: file.mimetype
        })
    
        // for testing purpose: comment these for stop storing files
        try {
          console.info(chalk.blueBright.bgBlack("[INF] HTTP Request to S3 for storing our markdown files"))
          const S3_SendRes = await s3Client.send(cmd);
          /** Returned data
           *  {
            '$metadata': {
              httpStatusCode: 200,
              requestId: 'MFCGQF89Z0BR73S1',
              extendedRequestId: 'Hw6cXBc3axGhMhCtZD2eOk0YJ38XwbSTBIhqUeGx0IlHkm8mYPCBQKpd7t5YzO5zDAhT4d7brxY=',
              cfId: undefined,
              attempts: 1,
              totalRetryDelay: 0
            },
            ETag: '"d41d8cd98f00b204e9800998ecf8427e"',
            ServerSideEncryption: 'AES256'
          }
            */
          console.log("S3_SendRes=",S3_SendRes)
        } catch (error) {
          console.error(error)
          return retResErrJson(res,500,`Error occured when trying to upload files into S3`)
        } 
  
        // Every info/metadata about the files will be recorded on our mongo DB
        articleAsset.content.push({
          fileName: file.originalname,
          relativePath:file.webkitRelativePath,
          mimeType: file.mimetype,
        })
      }
  
      console.log(`files['content']=`,files['content'])
    }
  }


  if(!isEmpty(body)){
    console.info(chalk.blueBright.bgBlack("[INF] handle Request Body"))
  
    body.contentStructureType && (articleAsset.contentStructureType = body.contentStructureType)

    body.totalWordCounts && (articleAsset.totalWordCounts = body.totalWordCounts)

  }

    
  console.log("final `articleAsset` to be saved=",articleAsset)

  // comment this for testing purpose, meaning it won't be actually save on the database. Conversely, umcomment to see the actual changes on database
  await articleAsset.save()

  return res.status(200).json({
    message:`success editing article asset. Article's title ${article.titleArticle.URLpath}`,
  })
}
