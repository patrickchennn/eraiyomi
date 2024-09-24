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
  [pagePath: string]:{
    hostName: string
    pageTitle: string
    screenPageViews: string
    country: string
    region: string
    city: string
  }
}
/**
 * Currently this getReport() will only get the "activeUsers" and "screenPageViews" reports.
 */
// @ts-ignore
export const getPostReport = async (): Promise<GetReportRes> => {
  let dataAnalytics: GetReportRes = {}
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: '2024-02-09', // it starts with this particular date because at that time I posted my first article
        endDate: 'today',
      },
    ],
    dimensions: [
      {
        name:"hostName"
      },
      {
        name: 'pagePath',
      },
      {
        name:"pageTitle"
      },
      {
        "name": "country"
      },
      {
        "name": "region"
      },
      {
        "name": "city"
      }
    ],
    dimensionFilter: {
      // filter by hostName, if env variable `NODE_ENV` is equal to "production", then giving the real values is the right approach. By saying real values, it refers to production deployed app
      filter: {
        fieldName: "hostName",
        stringFilter: {
          value: process.env.NODE_ENV==="production"?"eraiyomi.netlify.app":"localhost"
        }
      }
    },
    metrics: [
      {
        name: 'screenPageViews', // This is the metric for the total page views.
      },
    ],
  });
  // console.log('Report result:');
  // console.log("response=",response)
  const rows = response.rows
  // console.log("rows=",rows)

  if(rows!==undefined && rows!==null){

    rows.forEach(row => {
      const dimensionValues = row.dimensionValues!
      const metricValues = row.metricValues!
      // console.log("dimensionValues=",dimensionValues)
      // console.log("metricValues=",metricValues)

      // NOTE: only getting the `/post/*` analytics data
      // this prevents the other path such as `{userName}/*` to be included
      if(dimensionValues[1].value?.startsWith("/post/")){
        dataAnalytics = {
          ...dataAnalytics,
          [dimensionValues[1].value]:{
            hostName:dimensionValues[0].value!,
            pageTitle:dimensionValues[2].value!,
            screenPageViews:metricValues[0].value!,
            country:dimensionValues[3].value!,
            region:dimensionValues[4].value!,
            city:dimensionValues[5].value!,
          }
        }
      }
    });
  }
  return dataAnalytics
}

