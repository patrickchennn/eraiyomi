import  { Router } from "express"
import APIAuth from "../middleware/APIAuth.js";
import api_or_user_auth from "../middleware/api_or_user_auth.js";
import authVerify from "../middleware/authVerify.js";
import { deleteReplies } from "../controllers/reply/deleteReplies.js";
import { deleteReply } from "../controllers/reply/deleteReply.js";
import { getAllReplies } from "../controllers/reply/getAllReplies.js";
import { getReplies } from "../controllers/reply/getReplies.js";
import { postCommentReply } from "../controllers/reply/postCommentReply.js";
import { putReply } from "../controllers/reply/putReply.js";


export const routerReply = Router()

// all replies
routerReply.route("/api/article/:articleId/comment/replies")
  .get(getAllReplies)
;

// particular reply
routerReply.route("/api/article/:articleId/comment/:commentId/replies")
  .get(getReplies)
  .delete(
    (req,res,next)=>APIAuth(req,res,next,true),
    deleteReplies
  )
;

routerReply.route("/api/article/:articleId/comment/:commentId/reply")
  .post(
    api_or_user_auth(APIAuth,authVerify), 
    postCommentReply
  )
;

routerReply.route("/api/article/:articleId/comment/:commentId/reply/:replyId")
  .put(
    api_or_user_auth(APIAuth,authVerify),
    putReply
  )
  .delete(
    api_or_user_auth(APIAuth,authVerify),
    deleteReply
  )
;

// xx