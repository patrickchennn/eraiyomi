import { DELETE_article } from "../controllers/article/DELETE_article.js"
import { GET_article } from "../controllers/article/GET_article.js"
import { POST_article } from "../controllers/article/POST_article.js"
import { PUT_article } from "../controllers/article/PUT_article.js"
import  { Router } from "express"
import APIAuth from "../middleware/APIAuth.js"
import authVerify from "../middleware/authVerify.js";

import { GET_articles } from "../controllers/article/GET_articles.js"
import api_or_user_auth from "../middleware/api_or_user_auth.js";

export const routerArticle = Router()

routerArticle.route("/api/article")
  .get(GET_article)
  .post(
    (req,res,next)=>APIAuth(req,res,next,true), 
    POST_article
  )
;
  
routerArticle.route("/api/article/:articleId")
  .put(
    (req,res,next)=>APIAuth(req,res,next,true),
    PUT_article
  )
  .delete(
    api_or_user_auth(APIAuth,authVerify),
    DELETE_article
  )
;

routerArticle.route("/api/articles").get(GET_articles)