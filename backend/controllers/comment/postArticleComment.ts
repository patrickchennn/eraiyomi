import chalk from "chalk";
import { commentModel } from "../../schema/commentSchema.js";
import { replyModel } from "../../schema/replySchema.js";
import { Request,Response } from "express";

/**
 * @desc Any use can give a comment for any article 
 * @route POST /api/article/:articleId/comment
 * @access Public, login required
 * @todo there is a mismatch between the JWT token decoded user info and the user's info in `req.body`. Remove the req.body, solely rely on the user's information thourgh the decoded JWT token
 */
export const postArticleComment =  async (req: Request, res: Response) => {
  const {articleId} = req.params
  console.log(chalk.blue(`[API] POST /api/article/${articleId}/comment`))
  
  const {body} = req

  // console.log('body=',body)

  const newComment = {
    displayName: body.displayName,
    profilePictureUrl: body.profilePictureUrl,
    userId: body.userId,
    like: {
      likeCount: 0,
      users: {}
    },
    message: body.message,
    publishedAt: new Date().toISOString().slice(0, 10),
    updatedAt: null as string|null,
    totalRepliesCount: 0
  };
  
  const comment = await commentModel.findOneAndUpdate(
    { articleIdRef: articleId },
    {
      $push: { items: { $each: [newComment], $position: 0 } },
      $inc: { totalCommentsCount: 1 } // Increment totalCommentsCount by 1
    },
    { new: true }
  );
  // console.log("comment=",comment)

  if(comment===null){
    return res.status(404).json({
      message:`posting comment in article with id "${articleId}" is fail`
    })
  }


  const newlyAddedComment = comment!.items[0]; // Assuming the newly added item is at position 0
  // console.log(newlyAddedComment)

  await replyModel.findOneAndUpdate(
    {articleIdRef:articleId},
    {
      $push:{
        items:{
          parentCommentId: (newlyAddedComment as any)._id,
          replies:[]
        }
      }
    },
    {new: true}
  )



  return res.status(201).json(comment)
}
