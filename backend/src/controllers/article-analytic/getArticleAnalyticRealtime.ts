import { Request,Response } from "express"
import { getRealtime } from "./GoogleAnalyticsUtils.js"

export const getArticleAnalyticRealtime = async (
  req:Request,
  res:Response
) => {

  const reportRes = await getRealtime()
  console.log("reportRes=",reportRes)

  return res.status(200).json(reportRes)
}