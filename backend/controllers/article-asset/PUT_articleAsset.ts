import chalk from "chalk"
import { Request,Response } from "express"
import { isValidObjectId } from "mongoose"
import { articleAssetModel } from "../../schema/articleAssetSchema.js"
import { articleModel } from "../../schema/articleSchema.js"
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary'

interface ReqBodyPutArticleAsset{
  content?:string
  totalWordCounts: number
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
  console.log(chalk.yellow(`[API] PUT /api/article-asset/${articleId}`))
  
  
  const {body} = req
  // console.log("body=",body)
  // console.log("body.title=",body.title)
  // console.log("body.content=",body.content)

  
  
  const isArticleIdValid = isValidObjectId(articleId)
  console.log("isArticleIdValid=",isArticleIdValid)

  if(!isArticleIdValid){
    const msg = `400 Bad Request. Article with id "${articleId}" is invalid.`
    console.log(chalk.red.bgBlack(msg))
    return res.status(400).json({"message":msg})
  }

  const articleAsset = await articleAssetModel.findOne({articleIdRef:articleId})
  
  if(!articleAsset){
    const msg = `404 Bad Request. Article with id "${articleId}" is not found`
    console.log(chalk.red.bgBlack(msg))
    return res.status(404).json({"message":msg})
  }

  const article = await articleModel.findOne({_id: articleId}, 'titleArticle.URLpath')
  console.log("article=",article)
  if(article===null){
    const msg = `404 Not Found. article with id "${articleId} is not found"`
    console.log(chalk.red(msg))
    return res.status(404).json({"message":msg})
  }
  

  
  // FIND: all file that starts with `thumbnail`. IF found it will return its file name, ELSE returning `undefined`
  // const existingFiles = readdirSync(articleImagesFullPath)
  // console.log("existingFiles=",existingFiles)

  if(body.content){
    console.log(chalk.yellow.bgBlack("section: editing the quill content"))

    /* Purpose of `imgsToDelete` set container
      The purpose of this `imgsToDelete` is to track some files that are needed to be deleted or not. If some existed on that set, it means that files need to be deleted.
    */
    const imgsToDelete = new Set<string>()

    // loop the previous `articleAsset.content`. Mainly, we are looking for image object, and if found, store it to the set `imgsToDelete` for later checking whether we should delete the image or not.
    for(let i=0; i<articleAsset.content.length; i++){
      const data:{[key: string]: any} = articleAsset.content[i]

      // IF: we found an image among all of these quill data, or also I can say that, IF there is a new image that want to be saved on the database
      if(Object.hasOwn(data.insert,"image")){
        imgsToDelete.add(data.insert.image["data-public_id"] as string)
      }
    }
    console.log("initial: imgsToDelete=",imgsToDelete)


    // quillData is an array of object
    const quillData = JSON.parse(body.content) as [{}]
    // console.log("quillData=",quillData)

    articleAsset.content = quillData

    // START: content images logic
    console.log(chalk.yellow.bgBlack("section: content images logic"))


    for(let i=0; i<quillData.length; i++){
      const data:{[key: string]: any} = quillData[i]
      // console.log(`[${i}]:`,data)
      
      // IF: we found an image among all of these newly inputted quill data
      if(Object.hasOwn(data.insert,"image")){
        console.log(chalk.magenta.bgBlack("IF: found image at index: "),i)
        // console.log("before: data: ",data)

        // for storing the file name
        let filename

        // this can be data URL or external resources
        const imgSrc = data.insert.image.src as string
        // console.log("imgSrc=",imgSrc)

        // console.log(chalk.magenta.bgBlack("\tIF: img src type is data:image/png;base64"))

        filename = data.insert.image['data-filename']

        // upload to remote/cloud storage
        // doc for `upload()` method: https://cloudinary.com/documentation/image_upload_api_reference#upload
        let result!: UploadApiResponse;
        try {
          result = await cloudinary.uploader.upload(
            imgSrc,
            {
              use_filename:true,
              filename_override:filename,
              unique_filename:false,
              overwrite: false,
              folder:article.titleArticle.URLpath
            }, 
          );

          console.log("cloudinary.uploader.upload() callback=",result); 
        } 
        // @ts-ignore
        catch (error: UploadApiErrorResponse) {
          console.error(error);
          return res.status(500).send({
            message:error
          });

        }
      
        // the main purpose of this condition is about determining whether we should delete current image or not. False means we are gonna delete it, because we are preserving the set. True means we ain't gonna delete it, because we eventually pop/delete it's value in that set
        if(result.existing && imgsToDelete.has(result.public_id)){
          console.log(chalk.magenta.bgBlack(`IF: image ${result.public_id} already exist!`))
          imgsToDelete.delete(result.public_id)
        }

        /** after successfuly upload the img to cloud
         * some modification is needed for the image attributes
         * `src` is gonna have the https URL for the image
         * about these three below, currently I have no clear idea what I'm gonna about to use it
         * `data-filename` is the original filename
         * `data-public_id` is the `public_id` property in Cloudinary
         */
        articleAsset.content[i].insert.image.src = result.secure_url
        articleAsset.content[i].insert.image["data-public_id"] = result.public_id

        console.log("after: data: ",data)
      }
    }

    // actual logic for deleting the files
    console.log("after: imgsToDelete=",imgsToDelete)
    for(const img of imgsToDelete){
      console.log(chalk.magenta.bgBlack("FOR: delete file:"),img)
      let result;

      try {
        result = await cloudinary.uploader.destroy(
          img,
        );

        console.log("\tcloudinary.uploader.destroy() callback=",result); 
      } 
      // @ts-ignore
      catch (error) {
        console.error(error);
        return res.status(500).send({
          statusCode:"500 Server Internal Error",
          message:error
        });
      }
    }
    // END: content images logic
  }


  // update the word counter
  articleAsset.totalWordCounts = body.totalWordCounts
    
  // console.log("articleAsset.save()=",articleAsset)

  await articleAsset.save()

  console.log(chalk.green.bgBlack(`[API] PUT /api/article-asset/${articleId} 200\n`))
  return res.status(200).json({
    message:`success editing article asset. article's title ${article.titleArticle.URLpath}`,
  })
}