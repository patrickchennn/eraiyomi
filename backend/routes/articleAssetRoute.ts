import  { Router } from "express"
import multer from "multer"
import { GET_articleAsset } from "../controllers/article-asset/GET_articleAsset.js"
import { GET_articlesAsset } from "../controllers/article-asset/GET_articlesAsset.js"
import { PUT_articleAsset } from "../controllers/article-asset/PUT_articleAsset.js"
import APIAuth from "../middleware/APIAuth.js"
import isValidMongoId from "../middleware/isValidMongoId.js"

export const routerArticleAsset = Router()

const upload = multer()

routerArticleAsset.route("/api/articles-asset")
  .get(GET_articlesAsset)
;

routerArticleAsset.route("/api/article-asset")
  .get(isValidMongoId,GET_articleAsset)
;

routerArticleAsset.route("/api/article-asset/:articleId")
  .put(
    APIAuth, 
    isValidMongoId,
    // upload.single('thumbnail'),
    // upload.any(),
    upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'content', maxCount: 1 }]),
    PUT_articleAsset,
  )
;
