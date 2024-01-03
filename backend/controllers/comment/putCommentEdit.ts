import chalk from "chalk";
import { commentModel } from "../../schema/commentSchema.js";
import { Request,Response } from "express";

/**
 * @desc edit a comment (message)
 * @route PUT /api/article/:articleId/comment/:commentId?action=like|undefined
 * @access public, login required
 */
export const putCommentEdit =  async (req: Request, res: Response) => {
  const {commentId,articleId} = req.params
  const {action} = req.query

  const {body} = req
  const {email} = body.user
  console.log(chalk.blue(`[API] PUT /api/article/${articleId}/comment/${commentId}?action=${action}`))
  console.log(body)
  // console.log("email=",email)

  const comments = await commentModel.findOne(
    { articleIdRef: articleId },
  );
  // console.log(comments)
  
  
  if(comments===null){
    return res.status(404).json({
      message:`404 Not Found.\n articleId: ${articleId}\n`
    })
  }

  const foundComment = comments.items.find(item => (item as any)._id.toString() === commentId)
  // console.log("foundComment=",foundComment)

  if (!foundComment) {
    return res.status(404).json({
      message: `404 Not Found.\n commentId:${commentId}`
    });
  }
  
  // IF the user decide to like the comment
  if(action==="like"){
    let status

    // IF exist --> unlike, neutral
    if(
      foundComment.like!.users.hasOwnProperty(email)
    ){
      foundComment.like!.likeCount -= 1
      delete foundComment.like!.users[email]
      status = "unlike"
    }else{
      foundComment.like!.likeCount += 1
      foundComment.like!.users[email] = true
      status="like"
    }
    comments.markModified("items"); // Mark the items array as modified

    await comments.save()
    return res.status(201).json({
      message:`successfully ${status} "${foundComment.displayName}" comment`,
      comment:foundComment
    })
  }

  // IF there is no message at all
  if(!body.message){
    return res.status(400).json({
      message:"400 Bad Request. Cannot receive an empty message (string)"
    })
  }

  foundComment.message = body.message
  foundComment.updatedAt = new Date().toISOString().slice(0, 10)
  // comments.markModified("message");
  // comments.markModified("updatedAt"); 

  // Save the modified comment
  try {
    await comments.save();
    return res.status(201).json({
      message: `successfully update a comment for ${foundComment.displayName}`,
      comment: foundComment
    });
  } catch (error: any) {
    return res.status(500).json({
      message: `Error updating comment.\n`,
      error: error.message,
    });
  }
}
