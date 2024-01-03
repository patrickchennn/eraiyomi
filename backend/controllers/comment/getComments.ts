import chalk from "chalk";
import { commentModel } from "../../schema/commentSchema.js";
import { Request,Response } from "express";

/**
 * @desc Retrieve all comments from given a particular article
 * @route GET /api/article/:articleId/comments
 * @access public
 */
export const getComments = async (req: Request, res: Response) => {
  const {articleId} = req.params
  console.log(chalk.blue(`[API] GET /api/article/${articleId}/comments`))

  const comments = await commentModel.findOne(
    {articleIdRef:articleId}
  )
  if(comments===null){
    return res.status(404).send({
      message:`404 Not Found. article with id: ${articleId} is not found`
    })
  }
  

  return res.status(200).json(comments)

}