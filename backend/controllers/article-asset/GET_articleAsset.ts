import chalk from "chalk"
import { Request,Response } from "express"
import { isValidObjectId } from "mongoose"
import { articleAssetModel } from "../../schema/articleAssetSchema.js"
import { readFileSync } from "fs"
import { parentDirectory } from "../../server.js"
import isEmpty from "lodash.isempty"
import { articleModel } from "../../schema/articleSchema.js"

/**
 * @desc get an article asset
 * @route GET /api/article-asset/?id=${articleId}&title=${title}
 * @access public
 */
export const GET_articleAsset =  async (
  req: Request<{}, {}, {title: string},{id:string,title:string}>,
  res: Response
) => {
  const {id,title} = req.query

  console.log(chalk.yellow(`[API] GET /api/article-asset?id=${id}&title=${title}`))

  const isValid = isValidObjectId(id)
  // console.log("isValid=",isValid)

  if(!isValid){
    const msg = `404 Bad Request. Article with id "${id}" is not found`
    console.log(chalk.red.bgBlack(msg))
    return res.status(400).json({"message":msg})
  }

  const articleAsset = await articleAssetModel.findOne({articleIdRef:id}).lean()
  // console.log("articleAsset=",articleAsset)

  if(articleAsset===null){
    const msg = `404 Not Found. article-asset with id "${id} is not found"`
    console.log(chalk.red(msg))
    return res.status(404).json({"message":msg})
  }

  const article = await articleModel.findOne({id}, 'titleArticle.URLpath')
  // console.log("article=",article)
  
  if(article===null){
    const msg = `404 Not Found. article with id "${id} is not found"`
    console.log(chalk.red(msg))
    return res.status(404).json({"message":msg})
  }

  const articleImagesFullPath = `${parentDirectory}/article-images/${article.titleArticle.URLpath}`
  console.log("articleImagesFullPath=",articleImagesFullPath)

  // START: thumbnail img logic
  if(!isEmpty(articleAsset.thumbnail)){
    console.log(chalk.magenta.bgBlack("IF: found image thumbnail"))

    const thumbnailImgPath = `${articleImagesFullPath}/${articleAsset.thumbnail.filename}`

    // console.log("thumbnailImgPath=",thumbnailImgPath)

    const imageBinary = readFileSync(thumbnailImgPath);
    // console.log(imageBinary)

    // Convert binary data to a data URL
    const dataURL = `data:image/jpeg;base64,${imageBinary.toString('base64')}`;

    // Place it into the res body
    articleAsset.thumbnail.dataURL = dataURL
  }
  // END: thumbnail img logic

  // START: content images logic
  for(let i=0; i<articleAsset.content.length; i++){

    const data = articleAsset.content[i]
    // console.log(`[${i}]:`,data)

    if(Object.hasOwn(data.insert,"image")){
      console.log(chalk.magenta.bgBlack("IF: found image at index: "),i)
      console.log(`[${i}]:`,data)

      const imgSrc = data.insert.image.src
      if(imgSrc && imgSrc.startsWith("data:image/png;base64")){
        console.log(chalk.magenta.bgBlack("\tIF: img src type is data:image/png;base64"))

        const contentImgPath = `${articleImagesFullPath}/${data.insert.image["data-filename"]}`
        console.log("contentImgPath=",contentImgPath)
  
        
        const imageBinary = readFileSync(contentImgPath);
        console.log("imageBinary=",imageBinary)
  
        // Convert binary data to a data URL
        const dataURL = `data:image/png;base64,${imageBinary.toString('base64')}`;
        // console.log("dataURL=",dataURL)
  
        // Place it into the res body
        data.insert.image.src = dataURL
      }else{
        console.log(chalk.magenta.bgBlack("\tIF: img src type is probably from existing cloud"))
        // TODO: check whether the URL host a uncorrupted img or not
        // currently assuming the URL will always be okay
        continue
      }


    }
  }
  // END: content images logic

  console.log(chalk.green(`[API] GET /api/article-asset/?id=${id}&title=${title} 200\n`))
  return res.status(200).json(articleAsset)
}
// xk