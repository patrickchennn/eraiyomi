import  { Router } from "express"
import multer from "multer"
import { GET_articleAsset } from "../controllers/article-asset/GET_articleAsset.js"
import { GET_articlesAsset } from "../controllers/article-asset/GET_articlesAsset.js"
import { PUT_articleAsset } from "../controllers/article-asset/PUT_articleAsset.js"
import APIAuth from "../middleware/APIAuth.js"
import isValidMongoId from "../middleware/isValidMongoId.js"


// import { existsSync, mkdirSync } from "fs"

// const diskStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // console.log("file=",file)
//     const path = `/tmp/article-images`
//     if(!existsSync(path)) mkdirSync(path)
//     cb(null, path)
//   },
// })
const upload = multer({ storage:multer.memoryStorage() })

export const routerArticleAsset = Router()


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
    upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'content-files'}]),
    PUT_articleAsset,
  )
;
