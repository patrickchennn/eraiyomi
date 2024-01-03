import  { Router } from "express"
import { deleteComment } from "../controllers/comment/deleteComment.js";
import { deleteComments } from "../controllers/comment/deleteComments.js";
import { getComments } from "../controllers/comment/getComments.js";
import { postArticleComment } from "../controllers/comment/postArticleComment.js";
import { putCommentEdit } from "../controllers/comment/putCommentEdit.js";
import APIAuth from "../middleware/APIAuth.js";
import api_or_user_auth from "../middleware/api_or_user_auth.js";
import authVerify from "../middleware/authVerify.js";

export const routerComment = Router()

routerComment.route("/api/article/:articleId/comment")
  .post(
    api_or_user_auth(APIAuth,authVerify), 
    postArticleComment
  )
;


routerComment.route("/api/article/:articleId/comment/:commentId")
  .put(
    api_or_user_auth(APIAuth,authVerify), 
    putCommentEdit
  )
  .delete(
    api_or_user_auth(APIAuth,authVerify),
    deleteComment
  )
;


routerComment.route("/api/article/:articleId/comments")
  .get(
    getComments
  )
  .delete(
    (req,res,next)=>APIAuth(req,res,next,true),
    deleteComments
  )
;