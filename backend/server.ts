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
const analyticsDataClient = new BetaAnalyticsDataClient();
// console.log(analyticsDataClient)

// export GOOGLE_APPLICATION_CREDENTIALS=/c/Users/User/env/dev/eraiyomi/backend/credentials.json
// export GOOGLE_APPLICATION_CREDENTIALS="C:\Users\User\env\dev\eraiyomi\backend\credentials.json"




// Runs a simple report.
async function runReport() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: 'yesterday',
        endDate: 'today',
      },
    ],
    dimensions: [
      {
        name: 'pageLocation',
      },
    ],
    metrics: [
      {
        name: 'activeUsers',
      },
      {
        name: 'screenPageViews',
      },
      {
        name: 'screenPageViewsPerSession',
      },
      {
        name: 'screenPageViewsPerUser',
      },
    ],
  });
  console.log('Report result:');
  response.rows!.forEach(row => {
    // @ts-ignore
    console.log(row)
  });
}

runReport();
// adsdssdsadasdasdasdi