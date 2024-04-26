import chalk from "chalk"
import { Request,Response } from "express"
import { articleAssetModel } from "../../schema/articleAssetSchema.js"


/**
 * @desc Get all articles asset
 * @route GET /api/articles-asset
 * @access public
 */
export const GET_articlesAsset = async (req: Request, res:Response) => {
  console.log(chalk.yellow(`[API] ${req.method} ${req.originalUrl}`))
  
  
  const articlesAsset = await articleAssetModel.find({}).lean()
  // console.log("articlesAsset=",articlesAsset)

  if(articlesAsset===null){
    const msg = `500 Server Internal Error. Error when articleAssetModel.find()`
    console.log(chalk.red.bgBlack(msg))
    return res.status(500).json({"message":msg})
  }
  

  console.log(chalk.green(`[API] ${req.method} ${req.originalUrl}`))
  return res.status(200).json(articlesAsset)
}