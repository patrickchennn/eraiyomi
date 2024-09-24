import  { Router } from "express"
import { GET_articlesAnalytic } from "../controllers/article-analytic/getArticlesAnalytic.js"
export const routerArticleAnalytic = Router()

routerArticleAnalytic.route("/api/articles/analytic")
  .get(GET_articlesAnalytic)
