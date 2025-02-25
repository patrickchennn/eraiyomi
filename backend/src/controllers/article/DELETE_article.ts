import { Request,Response } from "express"
import { articleModel } from "../../schema/articleSchema.js"
import retResErrJson from "../../utils/retResErrJson.js"
import S3_deleteFolder from "../../utils/S3_deleteFolder.js"
import { HydratedDocument } from "mongoose"
import { User } from "@shared/User.js"


/**
 * @desc Delete an article
 * @endpoint DELETE /api/article/:articleId
 * @access private
 */
export const DELETE_article =  async (
  req: Request<
    {articleId: string}, 
    {}, 
    {user: HydratedDocument<User>}
  >, 
  res: Response
) => {
  const {articleId} = req.params

  const article = await articleModel.findById(articleId)
  console.log("article=",article)
  
  if(!article) return retResErrJson(res,404,"Article not found")
    
  const articleTitle = article.title

  // Remove article from user
  const {user} = req.body

  const idx = user.articleIdRef.findIndex((id: string) => articleId===id.toString())
  if (idx===-1) {
    console.error('Relation article with its author is not found');
    return retResErrJson(res, 500,"Relation article with its author is not found")
  }

  user.articleIdRef.splice(idx,1)
  console.log('Updated user.articleIdRef:', user.articleIdRef);
  
  await user.save()


  // Remove article
  try {
    await article.remove();
  } catch (err) {
    console.error('Error removing article:', err);
    return retResErrJson(res, 500,"Error removing article")
  }


  // Delete the related objects on S3
  const S3_deleteFolderRes = await S3_deleteFolder(articleTitle)
  console.log("S3_deleteFolderRes=",S3_deleteFolderRes)

  if(S3_deleteFolderRes===null){
    return retResErrJson(res, 500, "Error during deleting S3 objects")
  }


  return res.status(204).end()
}