import chalk from "chalk"
import { Request,Response } from "express"
import { replyModel } from "../../schema/replySchema.js"


/**
 * @desc get all replies 
 * @route POST /api/article/:articleId/comment/:commentId/replies
 * @access public
 */
export const getReplies =  async (req: Request, res: Response) => {
  const {articleId,commentId} = req.params
  console.log(chalk.blue(`[API] GET /api/article/${articleId}/comment/${commentId}/replies`))

  const replies = await replyModel.findOne(
    {articleIdRef:articleId, "items.parentCommentId":commentId},
    { "items.$": 1 }
  )
  // console.log("replies=",replies)
  
  if(replies===null){
    return res.status(404).json({
      message:"not found"
    })
  }
  
  const repliesArray = replies.items[0].replies || [];


  return res.status(200).json({
    parentCommentId: commentId,
    replies:repliesArray
  })
  
}