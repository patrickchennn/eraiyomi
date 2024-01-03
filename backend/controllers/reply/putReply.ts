import chalk from "chalk"
import { replyModel } from "../../schema/replySchema.js"
import { Request,Response } from "express"
import { User } from "@eraiyomi/types/User.js"

interface putReplyReqBody{
  // the object (with three properties) below are used only for testing
  user:User|{
    email:string
  }
  message: string
}
/**
 * @desc edit a reply (message)
 * @route PUT /api/article/:articleId/comment/:commentId/reply/:replyId?action=like|undefined
 * @access Public, login required
 */
export const putReply =  async (
  req: Request<
    {commentId: string,articleId:string,replyId: string}, 
    {}, 
    putReplyReqBody
  >, 
  res: Response
) => {
  const {articleId,commentId,replyId} = req.params
  const {action} = req.query
  const {body} = req
  
  console.log(
    chalk.blue(`[API] PUT /api/article/${articleId}/comment/${commentId}/reply/${replyId}?action=${action}`)
  )

  // console.log(body)
  // console.log("accountId=",accountId)

  // IF neither like nor message exist
  if(!action && !body.message){
    return res.status(400).json({
      "message":"400 Bad Request. Cannot receive an empty message (string)"
    })
  }

  const replyDoc = await replyModel.findOne(
    { articleIdRef: articleId },
  );
  
  if (!replyDoc) {
    return res.status(404).json({
      message:`404 Not Found.\n articleId: ${articleId}`
    })
  }
  
  const replyArray = replyDoc.items.find(item => item.parentCommentId===commentId)
  // console.log("replyArray",replyArray)

  if(!replyArray){
    return res.status(404).json({
      message:`404 Not Found.\n commentId: ${commentId}`
    })
  }

  const reply = replyArray.replies.find((reply) => reply.replyId === replyId);
  // console.log("reply=",reply)

  if (!reply) {
    return res.status(404).json({ message: `Reply with id: ${replyId} is not found` });
  }

  // IF like
  if(action==="like"){
    const {email} = body.user

    let status

    // IF exist --> unlike, neutral
    if(reply.like!.users.hasOwnProperty(email)){
      reply.like!.likeCount! -= 1;
      delete reply.like!.users[email]
      status = "unlike"
    }else{
      reply.like!.likeCount! += 1
      reply.like!.users[email] = true
      status="like"
    }
    replyDoc.markModified("items");

    await replyDoc.save()
    return res.status(201).json({
      message: `successfully ${status} a reply: ${reply.displayName}`,
      reply
    })
  }

  reply.message = body.message
  reply.updatedAt = new Date().toISOString().slice(0, 10)
  replyDoc.markModified("items");


  await replyDoc.save()

  return res.status(201).json({
    message: `successfully update a reply owned by "${reply.displayName}"`,
    reply
  });
}