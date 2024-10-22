import express from 'express'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


// middleware
import bodyParser from 'body-parser'
import cors from "cors"
import cookieParser from "cookie-parser"
import rateLimit from 'express-rate-limit'
import afterResponseLogger from './middleware/afterResponseMiddleware.js'
import notFound from './middleware/notFound.js'

// ./routes
import { routerArticle } from './routes/articleRoute.js'
import { routerUser } from './routes/userRoute.js'
import { routerArticleAsset } from './routes/articleAssetRoute.js'
import { routerArticleAnalytic } from './routes/articleAnalytic.js'

// cloud services
import { v2 as cloudinary } from 'cloudinary'

// db
import mongoose from 'mongoose'
import connectDB from './config/db.js'

// logging
import indexLogger from './loggers/indexLogger.js'
import chalk from 'chalk'




          
cloudinary.config({ 
  cloud_name: "eraiyomi-server-images", 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET
})


mongoose.set('strictQuery', true);

const nodeEnv = process.env.NODE_ENV as "development" | "production";
// console.log("nodeEnv=",nodeEnv)

// connect to mongodb database
connectDB()

const app = express()
const port = process.env.PORT as string // PORT=8001

/** ## Third party middleware*/
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json({strict:false}))
app.use(cors({
  origin: ['http://localhost:3000',"https://blog.eraiyomi.com"], // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin
  credentials: true // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
}))
app.use(cookieParser())
app.set('etag', false); // turn off `etag`


const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	// store: ... , // Use an external store for more precise rate limiting
})

app.use(limiter)


app.use(afterResponseLogger)


/** ## API/route layer
 * @APIAuth method, currently is used for restricting the endpoint. No one access it because it needs an API key and I never expose the key on the public (that's how it suppossed to be). So, the end point that marked with the method only available to the dev
*/


// user
app.use(routerUser)

// article
app.use(routerArticle)

// article-asset
app.use(routerArticleAsset)

// article analytic
app.use(routerArticleAnalytic)

app.use(notFound);


// error handling middleware
// app.use(errorHandler)

const server = app.listen(
  port, 
  () => {
    // Log successful server start
    indexLogger.info({
      message: `[express] App is running`,
      phase: nodeEnv,
      port: port,
      url: `http://localhost:${port}`,
      timestamp: new Date().toISOString(),
    });
  }
);

// Capture server listen errors
server.on('error', (err: NodeJS.ErrnoException) => {
  if (nodeEnv === "development") {
    return console.log(chalk.red(err));
  }
  if (err.code === 'EADDRINUSE') {
    indexLogger.error({
      message: `[express] Port ${port} is already in use`,
      code: err.code,
      timestamp: new Date().toISOString(),
    });
  } else {
    indexLogger.error({
      message: `[express] Server error: ${err.message}`,
      code: err.code || 'Unknown',
      timestamp: new Date().toISOString(),
    });
  }
  // @TODO: these are not working. The flow is supposed to be: 1. wait the winston successfully write the error log to file, 2. exit syscall. But the winston log is not writing anything to log file, and the app just immediately exited.
  // // Ensure logs are flushed before exit
  // indexLogger.on('finish', () => process.exit(1));
  // indexLogger.end(); // Finish the logging stream
});
