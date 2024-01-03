import chalk from "chalk"
import { Request,Response } from "express"
import { articleModel } from "../../schema/articleSchema.js"
import { commentModel } from "../../schema/commentSchema.js"
import { articleAssetModel } from "../../schema/articleAssetSchema.js"
import { replyModel } from "../../schema/replySchema.js"
import { parentDirectory } from "../../server.js"
import { existsSync, rmSync } from "fs"

/**
 * @desc delete a article. If an article is deleted, 'comments' document must be also deleted
 * @route DELETE /api/article/:articleId
 * @access Private
 */
export const DELETE_article =  async (req: Request, res: Response) => {
  const {articleId} = req.params
  console.log(chalk.yellow(`[API] DELETE /api/article/${articleId}`))

  const article = await articleModel.findById(articleId)
  const commentsDoc = await commentModel.findOne({articleIdRef:articleId})
  const replyDoc = await replyModel.findOne({articleIdRef:articleId})
  const articleAsset = await articleAssetModel.findOne({articleIdRef:articleId})


  // console.log("article=",article)
  // console.log("commentsDoc=",commentsDoc)
  // console.log("replyDoc=",replyDoc)
  // console.log("articleAsset=",articleAsset)


  
  if(article && commentsDoc && replyDoc && articleAsset){
    const articleImagesFullPath = `${parentDirectory}/article-images/${article.titleArticle.URLpath}`;

    if (existsSync(articleImagesFullPath)) {
      rmSync(articleImagesFullPath, { recursive: true, force: true });
    }
    await article.remove();
    await commentsDoc.remove();
    await replyDoc.remove()
    await articleAsset.remove();

    console.log(chalk.green(`[API] DELETE /api/article/${articleId} 204\n`))
    return res.status(204).end()
  }

  return res.status(404).send(`Article with id "${articleId} is not found"`)
}
