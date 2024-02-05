import express from 'express'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import chalk from 'chalk'
import mongoose from 'mongoose'

// import {GoogleAuth, OAuth2Client} from 'google-auth-library'
// import {google} from 'googleapis';
// import { authenticate } from '@google-cloud/local-auth'
// import process from 'process';

// middleware
import bodyParser from 'body-parser'
import cors from "cors"
import cookieParser from "cookie-parser"
import rateLimit from 'express-rate-limit'
import errorHandler from './middleware/errorHandler.js'

import connectDB from './config/db.js'
import path from 'path';
import { fileURLToPath } from 'url';

// ./routes
import { routerArticle } from './routes/articleRoute.js'
import { routerUser } from './routes/userRoute.js'
import { routerArticleAsset } from './routes/articleAssetRoute.js'
import { routerArticleAnalytic } from './routes/articleAnalytic.js'


// we need to change up how __dirname is used for ES6 purposes
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// console.log("__dirname=",__dirname)

// Navigate up 2 level to get the parent directory `backend`
// to illustrate: build/backend/server.js/../../backend
// we need to reach the `backend` real directory
// when the typescript project get compiled, this file `server.ts` will be on `./build/server.js` so we need to go back twice
export const parentDirectory = path.join(__dirname, '..');
console.log("parentDirectory=",parentDirectory)



mongoose.set('strictQuery', true);


// connect to mongodb database
connectDB()

const app = express()
const port = process.env.PORT as string // PORT=8000


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json({strict:false}))
app.use(cors({
  origin: ['http://localhost:3000',"https://eraiyomi.netlify.com"], // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin
  credentials: true // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
}))
app.use(cookieParser())
app.set('etag', false); // turn off
// END: third-party middleware


// used for all requests
// rate limiter API
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	// store: ... , // Use an external store for more precise rate limiting
})

// Apply the rate limiting middleware to all requests
// app.use(limiter)



/* API/route layer
- @APIAuth method, currently is used for restricting the endpoint. No one access it because it needs an API key and I never expose the key on the public. So, the end point that marked with the method only available to the @dev
*/
// user
app.use(routerUser)

// article
app.use(routerArticle)

// article-asset
app.use(routerArticleAsset)


// article analytic
app.use(routerArticleAnalytic)

// error handling middleware
app.use(errorHandler)

app.listen(
  port, 
  () => console.log(chalk.green(`[express] app listening on port http://localhost:${port}`))
);