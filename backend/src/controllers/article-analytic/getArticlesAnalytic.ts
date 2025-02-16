import { Request,Response } from "express"
import {getRawBasicArticleReports} from "./GoogleAnalyticsUtils.js"
import chalk from "chalk"
import { isValidObjectId } from "mongoose"
import retResErrJson from "../../utils/retResErrJson.js"
import { ArticlesAnalytic } from "@shared/Article.js"


export const getArticlesAnalytic = async (
  req:Request,
  res:Response
) => {

  const reportRes = await getRawBasicArticleReports()
  if(reportRes===null){
    return retResErrJson(res,500,"Error getting google analytics report")
  }
  console.log("reportRes=",reportRes)

  const {dimensionHeaders,metricHeaders,rows} = reportRes

  let dataAnalytics: ArticlesAnalytic = {}
  
  if(rows!==undefined && rows!==null){
    for(let i=0; i<rows.length; i++){
      const row = rows[i]
      const dimensionValues = row.dimensionValues!
      const metricValues = row.metricValues!
      // console.log("dimensionValues=",dimensionValues)
      // console.log("metricValues=",metricValues)

      const pagePathPlusQueryString = dimensionValues[3].value!
      // console.log("pagePathPlusQueryString=",pagePathPlusQueryString)

      const queryString = pagePathPlusQueryString.split('?')[1] || "";
      // console.log("queryString=",queryString)
      
      const searchParams = new URLSearchParams(queryString);
      // console.log("searchParams=",searchParams)

      const articleId = searchParams.get("id")
      if(!articleId) continue

      if(!isValidObjectId(articleId)) continue


      dimensionValues.forEach((dimensionVal, idx) => {
        const dimensionKey = dimensionHeaders![idx].name
        dataAnalytics[articleId] = {
          ...dataAnalytics[articleId],
          [dimensionKey as keyof ArticlesAnalytic]: dimensionVal.value
        }
      })

      metricValues.forEach((metricVal,idx) => {
        const metricKey = metricHeaders![idx].name
        dataAnalytics[articleId] = {
          ...dataAnalytics[articleId],
          [metricKey as keyof ArticlesAnalytic]: metricVal.value
        }
      })
    }
  }

  console.info(chalk.blueBright.bgBlack("dataAnalytics="),dataAnalytics)
  return res.status(200).json(dataAnalytics)
}