import chalk from "chalk"
import { Request,Response } from "express"
import { articleAssetModel } from "../../schema/articleAssetSchema.js"
import { articleModel } from "../../schema/articleSchema.js"
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import retResErrJson from "../../utils/retResErrJson.js"

interface ReqBodyPutArticleAsset{
  contentStructureType: string
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
  
  
  const {body} = req
  // console.log("body=",body)
  // console.log("files=",files)


  const articleAsset = await articleAssetModel.findOne({articleIdRef:articleId})
  
  if(!articleAsset){
    return retResErrJson(res,404,`Article with id "${articleId}" is not found`)
  }

  const article = await articleModel.findOne({_id: articleId}, 'titleArticle.URLpath')
  // console.log("article=",article)

  if(article===null){
    return retResErrJson(res,500,`Article with id="${articleId} is not found, but article-asset is found, with id=${articleAsset._id}. It's 500 Internal Server Error because article and article-asset suppossed to be exist respectively.`)
  }

  // IF thumbnail image is provided
  if(req.files!==undefined && Object.hasOwn(req.files, 'thumbnail')){
    // @ts-ignore
    // original error: Element implicitly has an 'any' type because expression of type '"thumbnail"' can't be used to index type '{ [fieldname: string]: File[]; } | File[]'. Property 'thumbnail' does not exist on type '{ [fieldname: string]: File[]; } | File[]'.ts(7053)
    // TODO: fix this
    const thumbnail = req.files["thumbnail"][0]
    // console.log("thumbnail=",thumbnail)
    // console.log(Buffer.isBuffer(thumbnail.buffer))


    let uploadResult!: any;
    try {
      uploadResult = await new Promise((resolve) => {
        cloudinary.uploader.upload_stream(
          {
            use_filename:true,
            filename_override:"thumbnail",
            unique_filename:false,
            folder:article.titleArticle.URLpath,
          },
          (error, uploadResult) => {
            return resolve(uploadResult);
          }).end(thumbnail.buffer);
      });
      // console.log("uploadResult=",uploadResult)
    } 
    // @ts-ignore
    catch (error: UploadApiErrorResponse) {
      return retResErrJson(res,500,error)
    }

    const thumbnailTemp = {
      fieldName: thumbnail.fieldname,
      originalname: thumbnail.originalname,
      encoding: thumbnail.encoding,
      mimetype: thumbnail.mimetype,
      filename: thumbnail.originalname,
      size: thumbnail.size,
      dataURL: uploadResult.secure_url,
    }
    articleAsset.thumbnail = thumbnailTemp
  }
  

  if(body.content){
    if(body.contentStructureType=="quilljs"){
      // console.log(chalk.yellow.bgBlack(`body.contentStructureType=="quilljs"`))
      await handleQuill(req,res,article,articleAsset)

    }else if(body.contentStructureType=="markdown"){
      // console.log(chalk.yellow.bgBlack(`body.contentStructureType=="markdown"`))
      articleAsset.contentStructureType = "markdown"
      // TODO: assuming no images assset
      articleAsset.content = body.content
    }

    // update the word counter
    articleAsset.totalWordCounts = body.totalWordCounts
  }


    
  // console.log("articleAsset.save()=",articleAsset)

  // comment this for testing purpose, meaning it won't be actually save on the database. Conversely, umcomment to see the actual changes on database
  await articleAsset.save()

  return res.status(200).json({
    message:`success editing article asset. Article's title ${article.titleArticle.URLpath}`,
  })
}
















// @TODO: change `any` to appropriate type
async function handleQuill(
  req: Request, 
  res: Response, 
  article:any,
  articleAsset:any
){
  const {body} = req

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


// async function handleMD(){
// // xx
// }