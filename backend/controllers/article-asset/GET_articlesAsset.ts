import chalk from "chalk"
import { Request,Response } from "express"
import { articleAssetModel } from "../../schema/articleAssetSchema.js"
import isEmpty from "lodash.isempty"
import { readFileSync } from "fs"
import { parentDirectory } from "../../index.js"
import { articleModel } from "../../schema/articleSchema.js"

/**
 * @desc Get all articles asset
 * @route GET /api/articles-asset
 * @access public
 */
export const GET_articlesAsset = async (req: Request, res:Response) => {
  console.log(chalk.yellow(`[API] GET /api/articles-asset`))
  
  
  const articlesAsset = await articleAssetModel.find({}).lean()
  // console.log("articlesAsset=",articlesAsset)

  if(articlesAsset===null){
    const msg = `500 Server Internal Error. Error when articleAssetModel.find()`
    console.log(chalk.red.bgBlack(msg))
    return res.status(500).json({"message":msg})
  }
  
  
  for(const articleAsset of articlesAsset){
    const articleId = articleAsset.articleIdRef
    const article = await articleModel.findOne({articleId}, 'titleArticle.URLpath')
    // console.log("article=",article)

    if(article===null){
      const msg = `404 Not Found. article with id "${articleId} is not found"`
      console.log(chalk.red(msg))
      return res.status(404).json({"message":msg})
    }

    const articleImagesFullPath = `${parentDirectory}/article-images/${article.titleArticle.URLpath}`;

    // console.log("articleAsset.thumbnail=",articleAsset.thumbnail)
    // console.log("isEmpty(articleAsset.thumbnail)=",isEmpty(articleAsset.thumbnail))

    // START: thumbnail img logic
    if(!isEmpty(articleAsset.thumbnail)){
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

      if(Object.hasOwn(data.insert,"image")){

        // ori
        const contentImgPath = `${articleImagesFullPath}/${data.insert.image["data-filename"]}`

        // const contentImgPath = `${articleImagesFullPath}/${data.insert.attributes["data-filename"]}`


        // console.log("contentImgPath=",contentImgPath)
        const imageBinary = readFileSync(contentImgPath);

        // Convert binary data to a data URL
        const dataURL = `data:image/png;base64,${imageBinary.toString('base64')}`;

        // Place it into the res body
        data.insert.image.src = dataURL

      }
    }
    // END: content images logic
  }

  console.log(chalk.green(`[API] GET /api/articles-asset 200\n`))
  return res.status(200).json(articlesAsset)
}

// xxx