import express from 'express'

// middleware
import bodyParser from 'body-parser'
import cors from "cors"
import cookieParser from "cookie-parser"
import rateLimit from 'express-rate-limit'
import afterResponseLogger from './src/middleware/afterResponseMiddleware.js'
import notFound from './src/middleware/notFound.js'

// ./routes
import { routerArticle } from './src/routes/articleRoute.js'
import { routerUser } from './src/routes/userRoute.js'
import { routerArticleAnalytic } from './src/routes/articleAnalytic.js'

// cloud services
import { S3Client } from '@aws-sdk/client-s3'

// db
import mongoose from 'mongoose'
import connectDB from './src/config/db.js'

// logging
import indexLogger from './src/loggers/indexLogger.js'
import chalk from 'chalk'


// ~~~~~~~~~~AWS S3 config~~~~~~~~~~
const AWS_ACCESSKEYID = process.env.AWS_ACCESSKEYID
const AWS_SECRETACCESSKEY = process.env.AWS_SECRETACCESSKEY
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
const AWS_REGION = process.env.AWS_REGION

// console.log("AWS_ACCESSKEYID=",AWS_ACCESSKEYID)
// console.log("AWS_SECRETACCESSKEY=",AWS_SECRETACCESSKEY)
// console.log("AWS_BUCKET_NAME=",AWS_BUCKET_NAME)
// console.log("AWS_REGION=",AWS_REGION)

// Initialize an S3 client with provided credentials
// @ts-ignore
export const s3Client = new S3Client({
  region: AWS_REGION, // Specify the AWS region from environment variables
  credentials: {
    accessKeyId: AWS_ACCESSKEYID, // Access key ID from environment variables
    secretAccessKey: AWS_SECRETACCESSKEY // Secret access key from environment variables
  }
});



const nodeEnv = process.env.NODE_ENV as "development" | "production" | "staging";
let port = 8000

// Determine port
if(nodeEnv==='staging'){
  port=8001
}else if(nodeEnv==="production"){
  port=8002
}

mongoose.set('strictQuery', true);
connectDB()


const app = express()

// ~~~~~~~~~~Third party middleware~~~~~~~~~~
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json({strict:false}))
app.use(cors({
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin
  origin: [
    "http://localhost:3000", // Allow development
    "https://staging-client.eraiyomi.com", // Allow staging server
    "https://www.eraiyomi.com", // Allow production
  ],
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
  credentials: true 
}))
app.use(cookieParser())
app.set('etag', false); // turn off `etag`


const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 15 minutes
	max: nodeEnv==="development" ? 10000 : 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	// store: ... , // Use an external store for more precise rate limiting
})

app.use(limiter)

// Log after every request is being made
app.use(afterResponseLogger)


// ~~~~~~~~~~Express Routing~~~~~~~~~~
// user
app.use(routerUser)

// article
app.use(routerArticle)

// article analytic
app.use(routerArticleAnalytic)

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Handle error not found REST endpoint
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