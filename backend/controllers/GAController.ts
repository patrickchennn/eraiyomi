import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


// GAController = Google Analytics Controller

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
      private_key: process.env.private_key as string,
      client_email: process.env.client_email as string,
    },
    projectId:process.env.projectId as string
  }
);



interface DataAnalytics{
  [pagePath: string]:{
    activeUsers:string, 
    screenPageViews:string,
  }
}
/**
 * Currently this getReport() will only get the "activeUsers" and "screenPageViews" reports.
 */
export const getReport = async (): Promise<DataAnalytics> => {
  let dataAnalytics: DataAnalytics = {}
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: '7daysAgo',
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
    ],
    metrics: [
      {
        name: 'activeUsers',
      },
      {
        name: 'screenPageViews',
      },
    ],
    dimensionFilter: {
      // Filter hostname such name is not started with eraiyomi. In other word, just get the analytics data either from "eraiyomi.web.app" or "eraiyomi.firebaseapp.com".
      //  This filters the localhost (local ip address) analytics. I do not want that data because localhost is not a real views it is just for testing (development) purpose.
      orGroup:{
        expressions:[
          {
            filter: {
              fieldName: "hostName",
              stringFilter: {
                value: "eraiyomi.web.app"
              }
            },
          },
          {
            filter: {
              fieldName: "hostName",
              stringFilter: {
                value: "eraiyomi.firebaseapp.com"
              }
            },
          }
        ]
      }
    },
  });
  // console.log('Report result:');
  response.rows!.forEach(row => {
    const dimensionValues = row.dimensionValues
    const metricValues = row.metricValues
    // console.log(row)
    dataAnalytics = {
      ...dataAnalytics,
      [dimensionValues![1].value as string]:{
        activeUsers:metricValues![0].value as string,
        screenPageViews:metricValues![1].value as string
      }
    }
  });
  return dataAnalytics
}
