// Imports the Google Analytics Data API client library.
import {BetaAnalyticsDataClient} from '@google-analytics/data'

/**
 * TODO (developer): Uncomment this variable and replace with your Google Analytics 4 property ID before running the sample. [DONE]
 */
const propertyId: string = '347340790';

// console.log(process.env.private_key)

// Using a default constructor instructs the client to use the credentials specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
// console.log("process.env.CLIENT_EMAIL=",process.env.CLIENT_EMAIL)
const analyticsDataClient = new BetaAnalyticsDataClient(
  {
    credentials:{
      private_key: process.env.PRIVATE_KEY as string,
      client_email: process.env.CLIENT_EMAIL as string,
    },
    projectId:process.env.PROJECT_ID as string
  }
);

/**
 * Create a basic report - https://developers.google.com/analytics/devguides/reporting/data/v1/basics
 */
export async function getRawBasicArticleReports(){
  let response
  try {
    [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '2025-02-01', // it starts with this particular date because at that time I posted my first article
          endDate: 'today',
        },
      ],
      dimensions: [
        {name:"hostName"},
        {name:"pageTitle"},
        {name: 'pagePath',},
        {name: "pagePathPlusQueryString"},
        {name: "country"},
        {name: "region"},
        {name: "city"},
        // {name: "customEvent:view_article"}
  
      ],
      dimensionFilter: {
        // Filter by `hostName`: If env variable `NODE_ENV` is equal to "production", then giving the real values is the right approach. By saying real values, it refers to production deployed app
        filter: {
          fieldName: "hostName",
          stringFilter: {
            value: process.env.NODE_ENV==="production"?"eraiyomi.com":"localhost"
          }
        }
      },
      metrics: [
        {
          name: 'screenPageViews', // This is the metric for the total page views.
        },
      ],
    });
  } catch(err){
    console.error(err)
    return null
  }
  // console.log('Report result:');
  // console.log("response=",response)


  return response
}




/**
 * Create a Realtime Report - https://developers.google.com/analytics/devguides/reporting/data/v1/realtime-basics
 */
export async function getRealtime() {
  let response
  try {
    [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      dimensions: [
        { name: 'country' },          // User's country
        { name: 'city' },             // User's city
        { name: 'deviceCategory' },   // Device type (desktop, tablet, mobile)
        // { name: 'pageTitle' },        // Title of the viewed page
        // { name: 'pagePath' },         // Path of the viewed page
        { name: 'unifiedScreenName' }, // Name of the screen (for mobile apps)
        // {name: "customEvent:view_article"}
      ],
      metrics: [
        { name: 'activeUsers' },      // Number of active users
        { name: 'screenPageViews' },  // Total number of page views
        { name: 'eventCount' },       // Count of events
      ],
      // Optional: Filter by hostName based on environment
      // dimensionFilter: {
      //   filter: {
      //     fieldName: 'hostName',
      //     stringFilter: {
      //       value: process.env.NODE_ENV === 'production' ? 'eraiyomi.com' : 'localhost'
      //     }
      //   }
      // }
    });
    
  } catch (error) {
    console.error(error)
    return null
  }

  console.log('Report result:');
  console.log('response=', response);

  if(response.rows!==undefined && response.rows!==null){

    response.rows.forEach((row) => {
      const dimensionValues = row.dimensionValues!
      const metricValues = row.metricValues!
      console.log("dimensionValues=",dimensionValues)
      console.log("metricValues=",metricValues)
    });
  }
  return response;
}

/** Useful Docs
 * 
 * Introduction to Google Analytics - https://developers.google.com/analytics/devguides/collection/ga4 (Accessed on Feb 2025)
 * Google Analytics Data API - https://developers.google.com/analytics/devguides/reporting/data/v1/rest (Accessed on Feb 2025)
 * API Dimensions & Metrics - https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#dimensions (Accessed on Feb 2025)
 * Google Analytics Data: Node.js Client - https://www.npmjs.com/package/@google-analytics/data (Accessed on Feb 2025)
 * Google Analytics Data: Node.js Client - https://googleapis.dev/nodejs/analytics-data/latest/index.html#installing-the-client-library (Accessed on Feb 2025)
 */