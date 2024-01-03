/** docs
 * main doc for getting G.Analytics report: https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries
 * https://googleapis.dev/nodejs/analytics-data/latest/index.html#installing-the-client-library
 * about the node js SDK for G.Analytics report: https://www.npmjs.com/package/@google-analytics/data
 * platfrom to test the Google Analytics Data API: https://developers.google.com/analytics/devguides/reporting/data/v1/rest
 */

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


// GAUtils stands for Google Analytics Utilities

// Imports the Google Analytics Data API client library.
import {BetaAnalyticsDataClient} from '@google-analytics/data'

/**
 * TODO(developer): Uncomment this variable and replace with your
 *   Google Analytics 4 property ID before running the sample.
 */
const propertyId: string = '347340790';

// console.log(process.env.private_key)

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient(
  {
    credentials:{
      private_key: process.env.PRIVATE_KEY as string,
      client_email: process.env.CLIENT_EMAIL as string,
    },
    projectId:process.env.PROJECT_ID as string
  }
);


interface GetReportRes{
  [pageTitle: string]:{
    pagePath:string,
    screenPageViews:string,
  }
}
/**
 * Currently this getReport() will only get the "activeUsers" and "screenPageViews" reports.
 */
// @ts-ignore
export const getReport = async (): Promise<GetReportRes> => {
  let dataAnalytics: GetReportRes = {}
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: '7daysAgo', // it starts with this particular date because at that time I posted my first article
        endDate: 'today',
      },
    ],
    dimensions: [
      {
        name: 'pagePath',
      },
      {
        name:"pageTitle"
      },
    ],
    metrics: [
      {
        name: 'screenPageViews', // This is the metric for the total page views.
      },
    ],
// x
  });
  // console.log('Report result:');
  // console.log("response=",response)
  const rows = response.rows![0]
  // console.log("rows=",rows)


  response.rows!.forEach(row => {
    const dimensionValues = row.dimensionValues
    const metricValues = row.metricValues
    dataAnalytics = {
      ...dataAnalytics,
      [dimensionValues![1].value as string]:{
        pagePath:dimensionValues![0].value as string,
        screenPageViews:metricValues![0].value as string
      }
    }
  });
  return dataAnalytics
}

    // dimensionFilter: {
    //   // Filter hostname such name is not started with eraiyomi. In other word, just get the analytics data either from "eraiyomi.web.app" or "eraiyomi.firebaseapp.com".
    //   //  This filters the localhost (local ip address) analytics. I do not want that data because localhost is not a real views it is just for testing (development) purpose.
    //   orGroup:{
    //     expressions:[
    //       {
    //         filter: {
    //           fieldName: "hostName",
    //           stringFilter: {
    //             value: "eraiyomi.web.app"
    //           }
    //         },
    //       },
    //       {
    //         filter: {
    //           fieldName: "hostName",
    //           stringFilter: {
    //             value: "eraiyomi.firebaseapp.com"
    //           }
    //         },
    //       }
    //     ]
    //   }
    // },