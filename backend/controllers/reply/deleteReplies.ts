import chalk from "chalk";
import { Request,Response } from "express"
import { commentModel } from "../../schema/commentSchema.js";
import { replyModel } from "../../schema/replySchema.js";


/**
 * @desc delete all replies message on a particular comment section. 
 * @route DELETE /api/article/:articleId/comment/:commentId/replies
 * @access private
 */
export const deleteReplies =  async (req: Request, res: Response) => {
  const {articleId,commentId} = req.params

  console.log(chalk.yellow(`[API] DELETE /api/article/${articleId}/comment/${commentId}/replies`))

  const reply = await replyModel.findOneAndUpdate(
    {
      articleIdRef: articleId,
      "items.parentCommentId": commentId
    },
    {
      $pull: {
        "items.$[element].replies": {}
      }
    },
    {
      new: true,
      arrayFilters: [{ "element.parentCommentId": commentId }]
    }
  );

  console.log("reply=", reply);
  if (!reply) {
    return res.status(404).json({
      message: `404 Not Found. commentId: ${commentId} is not found`
    });
  }

  // reset the totalRepliesCount to 0
  await commentModel.findOneAndUpdate(
    { articleIdRef: articleId, "items._id": commentId },
    {
      $set: {
        "items.$.totalRepliesCount": 0,
      }, 
    },
    { new: true }
  );

  return res.status(204).end()
}