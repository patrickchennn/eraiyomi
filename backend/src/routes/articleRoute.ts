import  { Router } from "express"
import multer from "multer"

import { POST_article } from "../controllers/article/POST_article.js"
import { GET_article } from "../controllers/article/GET_article.js"
import { GET_articles } from "../controllers/article/GET_articles.js"
import { PUT_article } from "../controllers/article/PUT_article.js"
import { DELETE_article } from "../controllers/article/DELETE_article.js"

import apiAuth from "../middleware/apiAuth.js"
import isValidMongoId from "../middleware/isValidMongoId.js"
import userAuth from "../middleware/userAuth.js"

import GET_articleThumbnail from "../controllers/article/thumbnail/GET_articleThumbnail.js"
import PUT_articleThumbnail from "../controllers/article/thumbnail/PUT_articleThumbnail.js"
import DELETE_articleThumbnail from "../controllers/article/thumbnail/DELETE_articleThumbnail.js"
import POST_articleThumbnail from "../controllers/article/thumbnail/POST_articleThumbnail.js"
import { GET_articleContent } from "../controllers/article/content/GET_articleContent.js"
import DELETE_articleContent from "../controllers/article/content/DELETE_articleContent.js"
import POST_articleContent from "../controllers/article/content/POST_articleContent.js"
import { POST_articleImgContent } from "../controllers/article/image-content/POST_articleImgContent.js"
import { PUT_articleImgContent } from "../controllers/article/image-content/PUT_articleImgContent.js"
import PUT_articleContent from "../controllers/article/content/PUT_articleContent.js"

export const routerArticle = Router()

// import { existsSync, mkdirSync } from "fs"
// const diskStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log("file=",file)
//     const path = `/tmp/article-images`
//     if(!existsSync(path)) mkdirSync(path)
//     cb(null, path)
//   },
// })

const upload = multer({ 
  storage: multer.memoryStorage() 
  // storage: diskStorage
})

routerArticle.route("/api/article")
  .post(
    // apiAuth,
    userAuth,
    POST_article
  )
;

routerArticle.route("/api/articles").get(GET_articles)

routerArticle.route("/api/article/:articleId")
  .get(isValidMongoId,GET_article)
  .put(
    isValidMongoId,
    userAuth,
    PUT_article
  )
  .delete(
    isValidMongoId,
    userAuth,
    DELETE_article
  )
;

routerArticle.route("/api/article/:articleId/thumbnail")
  .post(
    isValidMongoId, 
    apiAuth, 
    upload.single("thumbnail"),
    POST_articleThumbnail
  )
  .get(isValidMongoId, GET_articleThumbnail)
  .put(
    isValidMongoId, 
    apiAuth,
    upload.single("thumbnail"),
    PUT_articleThumbnail
  )
  .delete(isValidMongoId, apiAuth, DELETE_articleThumbnail)
;

routerArticle.route("/api/article/:articleId/content")
  .post(
    isValidMongoId, 
    apiAuth, 
    upload.single("content"),
    POST_articleContent
  )
  .get(isValidMongoId, GET_articleContent)
  .put(
    isValidMongoId, 
    apiAuth,
    upload.single("content"),
    PUT_articleContent
  )
  .delete(
    isValidMongoId,
    apiAuth,
    DELETE_articleContent
  )
;

routerArticle.route("/api/article/:articleId/image-content")
  .post(
    isValidMongoId, 
    apiAuth, 
    upload.array("image-content"),
    POST_articleImgContent
  )
  .put(
    isValidMongoId, 
    apiAuth,
    upload.array("image-content"),
    PUT_articleImgContent
  )
;
