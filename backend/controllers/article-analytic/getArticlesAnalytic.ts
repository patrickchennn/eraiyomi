import { Request,Response } from "express"
import { getPostReport } from "./GAUtils.js"

/**
 * @TODO this is not limited to only `userId` as the search param. Adding more params like `username` and `email` is for future feature
 */
export const GET_articlesAnalytic = async (
  req:Request,
  res:Response
) => {

  const reportRes = await getPostReport()
  // console.log("reportRes=",reportRes)
  return res.status(200).json(reportRes)
}

