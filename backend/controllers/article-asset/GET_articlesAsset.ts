import { Request,Response } from "express"
import { articleAssetModel } from "../../schema/articleAssetSchema.js"
import retResErrJson from "../../utils/retResErrJson.js"


/**
 * @desc Get all articles asset
 * @route GET /api/articles-asset
 * @access public
 */
export const GET_articlesAsset = async (req: Request, res:Response) => {
  
  
  const articlesAsset = await articleAssetModel.find({}).lean()
  // console.log("articlesAsset=",articlesAsset)

  if(articlesAsset===null){
    return retResErrJson(res,500,`Error when articleAssetModel.find()`)
  }
  

  return res.status(200).json(articlesAsset)
}