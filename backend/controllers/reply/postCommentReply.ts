import { User } from "@patorikkuuu/eraiyomi-types"
import chalk from "chalk"
import { Request,Response } from "express"
import mongoose from "mongoose"
import { commentModel } from "../../schema/commentSchema.js"
import { replyModel } from "../../schema/replySchema.js"


interface CommentReplyReqBody{
  // the object (with three properties) below are used only for testing
  user: User | {
    username: string
    userId: string
    profilePictureUrl: string
  }
  message: string
}
/**
 * @desc Reply to a comment
 * @route POST /api/article/:articleId/comment/:commentId/reply
 * @access Public, login required
 * @todo there is a mismatch between the JWT token decoded user info and the user's info in `req.body`. Remove the req.body, solely rely on the user's information thourgh the decoded JWT token
 * 
 */
export const postCommentReply =  async (
  req: Request<{commentId: string,articleId:string}, {}, CommentReplyReqBody>, res: Response
) => {
  
  const {commentId,articleId} = req.params  
  console.log(chalk.blue(`[API] POST /api/article/${articleId}/comment/${commentId}/reply`))

  const {body} = req
  // console.log(body)

  const uniqueReplyId: string = (new mongoose.Types.ObjectId()).toString()

  const replyIdMod: string = `${commentId}.${uniqueReplyId}`


  const newReply = {
    replyId: replyIdMod,
    displayName: body.user.username,
    profilePictureUrl: body.user.profilePictureUrl,
    userId: body.user.userId,
    like: { 
      likeCount: 0,
      users: {}
    },
    message: body.message,
    publishedAt: new Date().toISOString().slice(0, 10),
    updatedAt: null as string|null,
  };

  const reply = await replyModel.findOneAndUpdate(
    { articleIdRef: articleId, "items.parentCommentId": commentId },
    { $push: { "items.$.replies": newReply } },
    { new: true }
  );
  // console.log("reply=",reply)

  if (!reply) {
    return res.status(404).json({
      message:`404 Not Found. comment with id: ${commentId}`
    });
  }

  // increase the totalRepliesCount according to the commentId
  await commentModel.findOneAndUpdate(
    { articleIdRef: articleId, "items._id": commentId },
    { $inc: { "items.$.totalRepliesCount": 1 } },
    { new: true }
  );

  return res.status(201).json(newReply)
}