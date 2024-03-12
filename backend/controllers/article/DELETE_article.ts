import chalk from "chalk"
import { Request,Response } from "express"
import { articleModel } from "../../schema/articleSchema.js"
import { articleAssetModel } from "../../schema/articleAssetSchema.js"

/**
 * @desc delete a article. If an article is deleted, 'comments' document must be also deleted
 * @route DELETE /api/article/:articleId
 * @access Private
 */
export const DELETE_article =  async (req: Request, res: Response) => {
  const {articleId} = req.params
  console.log(chalk.yellow(`[API] ${req.method} ${req.originalUrl}`))

  const article = await articleModel.findById(articleId)
  const articleAsset = await articleAssetModel.findOne({articleIdRef:articleId})


  // console.log("article=",article)
  // console.log("articleAsset=",articleAsset)


  
  if(article && articleAsset){

    await article.remove();
    await articleAsset.remove();

    console.log(chalk.green(`[API] DELETE /api/article/${articleId} 204\n`))
    return res.status(204).end()
  }

  return res.status(404).send(`Article with id "${articleId} is not found"`)
}
