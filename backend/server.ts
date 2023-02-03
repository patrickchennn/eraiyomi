import express from 'express'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import chalk from 'chalk'
import connectDB from './config/db.js'
import mongoose from 'mongoose'
import * as articleController from "./controllers/articleController.js"
import * as accountController from "./controllers/accountController.js"

import bodyParser from 'body-parser'
import errorHandler from './middleware/errorHandler.js'
import cors from "cors"
import cookieParser from "cookie-parser"

// Imports the Google Analytics Data API client library.
// const {BetaAnalyticsDataClient} = require('@google-analytics/data');
import {BetaAnalyticsDataClient} from '@google-analytics/data'


dotenv.config()
mongoose.set('strictQuery', true);


connectDB()

const app = express()
const port = process.env.PORT as string

// middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json({strict:false}))
app.use(errorHandler)
app.use(cors({
  origin: true,
  credentials: true 
}))
app.use(cookieParser())


// article
app.get('/api/articles', articleController.getArticles)
app.get('/api/article/:name', articleController.getArticle)
app.post('/api/article', articleController.postArticle)
app.put('/api/article/like/:articleId', articleController.putArticleLike)
app.delete("/api/article/delete/:articleId", articleController.deleteArticle)

// article/comment
app.get("/api/article/comments/:articleId", articleController.getComments)
app.post('/api/article/comment/:articleId', articleController.postArticleComment)
app.post('/api/article/comment/reply/:articleId/:uniqueCommentId', articleController.postCommentReply)
app.put('/api/article/comment/like-dislike/:articleId/:uniqueCommentId', articleController.putCommentLikeDislike)
app.put("/api/article/comment/edit/:articleId/:uniqueCommentId", articleController.putCommentEdit)
app.delete("/api/article/comment/delete/:articleId/:uniqueCommentId", articleController.deleteComment)

// account 
app.post("/api/account/login", accountController.postAccountLogin)



console.log(process.env.private_key)

app.listen(
  port, 
  () => console.log(chalk.green(`[express] app listening on port http://localhost:${port}`))
);

/**
 * TODO(developer): Uncomment this variable and replace with your
 *   Google Analytics 4 property ID before running the sample.
 */
const propertyId: string = '347340790';



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


// Runs a simple report.
async function runReport() {
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
        name: 'pageLocation',
      },
      {
        name:"hostName"
      }
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
      // Filter hostname such name is not started with eraiyomi. This filters the localhost (or 12.0.0.7) analytics. I do not want that because localhost is not a real views it is just for testing (development) purpose.
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
  console.log('Report result:');
  response.rows!.forEach(row => {
    console.log(row)
  });
}

runReport();
//asdasdasasasfgpo[]asdasdpppasdasd