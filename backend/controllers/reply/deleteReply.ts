import chalk from "chalk";
import { Request,Response } from "express"
import { commentModel } from "../../schema/commentSchema.js";
import { replyModel } from "../../schema/replySchema.js";


/**
 * @desc delete a single reply (message). 
 * @route DELETE /api/article/:articleId/comment/:commentId/reply/:replyId
 * @access Public, login required
 */
export const deleteReply =  async (req: Request, res: Response) => {
  const {articleId,commentId,replyId} = req.params

  console.log(chalk.yellow(`[API] DELETE /api/article/${articleId}/comment/${commentId}/reply/${replyId}`))

  const result = await replyModel.updateOne(
    {
      articleIdRef: articleId,
      "items.parentCommentId": commentId,
    },
    {
      $pull: {
        "items.$.replies": { replyId: replyId },
      },
    }
  );
  console.log("result=",result)
  
  if (result.modifiedCount === 0) {
    // No documents were modified, which means the specified replyId was not found.
    return res.status(404).json({
      message: `Reply with replyId: ${replyId} not found.`,
    });
  }

  // decrease the totalRepliesCount according to the commentId
  await commentModel.findOneAndUpdate(
    { articleIdRef: articleId, "items._id": commentId },
    { $inc: { "items.$.totalRepliesCount": -1 } },
    { new: true }
  );

  return res.status(204).end()
}
