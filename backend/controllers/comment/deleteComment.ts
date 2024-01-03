import chalk from "chalk";
import { commentModel } from "../../schema/commentSchema.js";
import { replyModel } from "../../schema/replySchema.js";
import { Request,Response } from "express";

/**
 * @desc delete a comment (message). 
 * @route DELETE /api/article/:articleId/comment/:commentId
 * @access Public, login required
 */
export const deleteComment =  async (req: Request, res: Response) => {
  const {commentId,articleId} = req.params

  console.log(chalk.blue(`[API] DELETE /api/article/${articleId}/comment/${commentId}`))

  const updatedComments = await commentModel.findOneAndUpdate(
    { articleIdRef: articleId,"items._id": commentId },
    { 
      $pull: { items: { _id: commentId } },
      $inc: { totalCommentsCount: -1 } // Decrement totalCommentsCount by 1
    },
    { new: true }
  );

  // console.log("updatedComments=",updatedComments)
  if(updatedComments===null){
    return res.status(404).json({
      message:`404 Not Found. comment with _id: ${commentId} is not found`
    })
  }


  // delete the related replies also
  const replies = await replyModel.updateMany(
    { articleIdRef: articleId },
    { $pull: { items: { parentCommentId: commentId } } }
  );
  if(replies===null){
    return res.status(404).json({
      message:`404 Not Found. There is something error with replies feature.`
    })
  }


  return res.status(204).end()
}