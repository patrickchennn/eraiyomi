import  { Router } from "express"
import multer from "multer"
import { GET_articleAsset } from "../controllers/article-asset/GET_articleAsset.js"
import { GET_articlesAsset } from "../controllers/article-asset/GET_articlesAsset.js"
import { PUT_articleAsset } from "../controllers/article-asset/PUT_articleAsset.js"
import APIAuth from "../middleware/APIAuth.js"
import { mkdirSync,existsSync } from "fs"

export const routerArticleAsset = Router()

// START: third-party middleware
// file middleware
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `/tmp/article-images`
    if(!existsSync(path)) mkdirSync(path)
    cb(null, path)
  },
  filename: function (req, file, cb) {
    // IF: the given file is intended as a thumbnail --> 
    if(file.fieldname==="thumbnail"){
      return cb(null, `${file.fieldname}-${file.originalname}`)
    }
    cb(null, file.originalname)
  }
})

const upload = multer({storage:storage})

routerArticleAsset.route("/api/articles-asset")
  .get(GET_articlesAsset)
;

routerArticleAsset.route("/api/article-asset")
  .get(GET_articleAsset)
;

routerArticleAsset.route("/api/article-asset/:articleId")
  .put(
    (req,res,next)=>APIAuth(req,res,next,true), 
    upload.single('thumbnail'),
    PUT_articleAsset,
  )
;