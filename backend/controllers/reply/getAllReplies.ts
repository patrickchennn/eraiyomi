import chalk from "chalk"
import { replyModel } from "../../schema/replySchema.js"
import { Request,Response } from "express"

/**
 * @desc get all replies 
 * @route POST /api/article/:articleId/comment/replies
 * @access public
 */
export const getAllReplies =  async (req: Request, res: Response) => {
  const {articleId,userCredToken} = req.params
  console.log(chalk.blue(`[API] GET /api/article/${articleId}/comment/replies`))

  const replies = await replyModel.findOne(
    {articleIdRef:articleId}
  )
  // console.log("replies=",replies)

  if(replies===null){
    return res.status(404).json({
      message:`404 Not Found. article with id: ${articleId} is not found`,
    })
  }

  return res.status(200).json(replies)
}