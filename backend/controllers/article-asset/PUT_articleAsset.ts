import chalk from "chalk"
import { Request,Response } from "express"
import { isValidObjectId } from "mongoose"
import { articleAssetModel } from "../../schema/articleAssetSchema.js"
import { existsSync, mkdirSync, readdirSync, renameSync, unlink, writeFile } from "fs"
import { parentDirectory } from "../../server.js"
import { articleModel } from "../../schema/articleSchema.js"

interface ReqBodyPutArticleAsset{
  content?:string
  relativePath?:string
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
    const msg = `404 Bad Request. Article with id "${articleId}" is invalid.`
    console.log(chalk.red.bgBlack(msg))
    return res.status(400).json({"message":msg})
  }

  const articleAsset = await articleAssetModel.findOne({articleIdRef:articleId})

  if(!articleAsset){
    const msg = `404 Bad Request. Article with id "${articleId}" is not found`
    console.log(chalk.red.bgBlack(msg))
    return res.status(400).json({"message":msg})
  }

  const article = await articleModel.findOne({articleId}, 'titleArticle.URLpath')
  // console.log("article=",article)
  if(article===null){
    const msg = `404 Not Found. article with id "${articleId} is not found"`
    console.log(chalk.red(msg))
    return res.status(404).json({"message":msg})
  }
  
  const articleImagesFullPath = `${parentDirectory}/article-images/${article.titleArticle.URLpath}`
  console.log("articleImagesFullPath=",articleImagesFullPath)

  // IF: the path/directory for storing the file does not exist --> create it. Actually this is considered as double check. Initially when creating an article the path must be already exist, already created in there
  if(!existsSync(articleImagesFullPath)) {
    console.log(chalk.magenta.bgBlack(`IF: article-images/${article.titleArticle.URLpath} directory does not exist`))

    mkdirSync(articleImagesFullPath)
  }
  
  // FIND: all file that starts with `thumbnail`. IF found it will return its file name, ELSE returning `undefined`
  const files = readdirSync(articleImagesFullPath)
  console.log("files=",files)

  if(body.content){
    console.log(chalk.yellow.bgBlack("section: editing the quill content"))
    
    // quillData is an array of object
    const quillData = JSON.parse(body.content) as [{}]
    // console.log("quillData=",quillData)

    articleAsset.content = quillData

    // START: content images logic
    console.log(chalk.yellow.bgBlack("section: content images logic"))
    /* Purpose of `contentImgs` set container
      The purpose of this `contentImgs` is to track some files that are needed to be deleted or not
    */
    const contentImgs = new Set<string>()

    for(let i=0; i<files.length; i++){
      const file = files[i]
      if(!file.startsWith("thumbnail")){
        contentImgs.add(file)
      }
    }
    console.log("contentImgs=",contentImgs)

    for(let i=0; i<quillData.length; i++){
      const data:{[key: string]: any} = quillData[i]
      // console.log(`[${i}]:`,data)
      
      // IF: we found an image among all of these quill data, or also I can say that, IF there is a new image that want to be saved on the database
      if(Object.hasOwn(data.insert,"image")){
        console.log(chalk.magenta.bgBlack("IF: found image at index: "),i)
        // console.log(data)

        const filename = data.insert.image['data-filename']
        console.log("filename=",filename)

        const imgSrc = data.insert.image.src as string
        // console.log("imgSrc=",imgSrc)

        let toBinary;
        // IF: the source image is from "Data URLs", and it's mimetype is `image/png`
        if(imgSrc.startsWith("data:image/png;base64")){
          // extract the true data, not the metadata `data:image/png;base64`
          const base64Data = imgSrc.replace(/^data:image\/\w+;base64,/, '');

          console.log(chalk.magenta.bgBlack("\tIF: img src type is data:image/png;base64"))

          toBinary = Buffer.from(
            base64Data, 
            'base64'
          );
        }else{
          console.log(chalk.magenta.bgBlack("\tIF: img src type is probably from existing cloud"))

        }


        // IF: the image does NOT exist on the filesystem --> add the image in it
        if(!existsSync(`${articleImagesFullPath}/${filename}`)){
          console.log(
            chalk.magenta.bgBlack(`\tIF: ${filename} does not exist, now creating+save the file`)
          )

          // add to FS(file system)
          writeFile(
            `${articleImagesFullPath}/${filename}`,
            toBinary,
            (err) => {
              if(err) console.error(err)
            }
          )
          // also add to database with some modification:
          // delete the `src` property because it contains data URL in which it stores bunch of binary image (that is converted into base64), and it could cause some headache for the database because of its size
          /* so to illustrate how is the datamodel gonna be:
           insert:{
             image:{
              src:<data url> --> will be deleted
              data-<file name> --> will be preserved
             }
           }
          */
          delete articleAsset.content[i].insert.image.src
        }
        // ELSE --> deciding whether to delete some file or not
        else{
          // CASE 1 DELETE SOME FILE. IF: the given file is available on the set data structure of `contentImgs` --> it means that file will still be preserved
          if(contentImgs.has(filename)){
            contentImgs.delete(filename)
          }
        }
      }

    }

    // actual logic for deleting the files
    for(const img of contentImgs){
      console.log(chalk.magenta.bgBlack("FOR: delete file:"),img)
      unlink(`${articleImagesFullPath}/${img}`, (err) =>{
        if (err) throw err;
        // console.log(`${img} was deleted`);
      }); 
  
    }
    // END: content images logic
  }


    
  // console.log("articleAsset.save()=",articleAsset)

  await articleAsset.save()

  console.log(chalk.green.bgBlack(`[API] PUT /api/article-asset/${articleId} 200; success editing article asset\n`))
  return res.status(201).json({
    message:`success editing article asset`,
    articleAsset
  })
}