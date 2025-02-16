import  { Router } from "express"
import { getArticlesAnalytic } from "../controllers/article-analytic/getArticlesAnalytic.js"
import { getArticleAnalyticRealtime } from "../controllers/article-analytic/getArticleAnalyticRealtime.js"
export const routerArticleAnalytic = Router()

routerArticleAnalytic.route("/api/articles/analytic")
  .get(getArticlesAnalytic)

routerArticleAnalytic.route("/api/articles/analytic/realtime")
  .get(getArticleAnalyticRealtime)
