import chalk from "chalk";
import { commentModel } from "../../schema/commentSchema.js";
import { replyModel } from "../../schema/replySchema.js";
import { Request,Response } from "express";

/**
 * @desc delete ALL comments. 
 * @route DELETE /api/article/:articleId/comments
 * @access private, no one can access this shit except me
 */
export const deleteComments = async (req: Request, res: Response) => {
  const {articleId} = req.params

  console.log(chalk.yellow(`[API] DELETE /api/article/${articleId}/comments`))

  const deletedComments = await commentModel.findOneAndUpdate(
    { articleIdRef: articleId},
    { 
      $set: { items: [],totalCommentsCount: 0 },
    },
    { new: true }
  );

  console.log("deletedComments=",deletedComments)
  if(deletedComments===null){
    return res.status(404).json({
      message:`404 Not Found. comment with _id: ${articleId} is not found`
    })
  }


  // delete the related replies also
  const replies = await replyModel.updateMany(
    { articleIdRef: articleId },
    { $set: { items:[] } }
  );

  if(replies===null){
    return res.status(500).json({
      message:`There is something error with replies feature/the server.`
    })
  }


  return res.status(204).end()
}
