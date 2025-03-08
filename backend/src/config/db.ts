import mongoose from 'mongoose'
import indexLogger from '../loggers/indexLogger.js';
import chalk from 'chalk';

const connectDB = async () => {
  const nodeEnv = process.env.NODE_ENV as "development" | "production" | "staging";

  // console.log("nodeEnv=",nodeEnv)
  // console.log("process.env.MONGO_USERNAME=",process.env.MONGO_USERNAME)
  // console.log("process.env.MONGO_PASSWORD=",process.env.MONGO_PASSWORD)
  
  let db = ""

  if(nodeEnv==="staging" || nodeEnv==="development"){
    db = "eraiyomi-staging"
  }else if(nodeEnv==="production"){
    db = "eraiyomi"
  }

  // const MONGODB_URI = null
  const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.jbtf902.mongodb.net/${db}?retryWrites=true&w=majority&appName=Cluster0`;

  try {
    const conn = await mongoose.connect(MONGODB_URI);
    indexLogger.info(`[database] MongoDB Connected to: ${conn.connection.host}:${conn.connection.port}, database name: ${conn.connection.name}`);
  } 
  catch (error: any) {
    console.error(chalk.red(error.message))
    indexLogger.error(`[database]: Connection failed with error: ${error.message}`);
    process.exit(1)
  }
}

export default connectDB

/** ## Docs
 * Main docs for Node.JS driver: https://www.mongodb.com/docs/drivers/node/current/quick-start/
 * Connection Guide: https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connect/#std-label-node-connect-to-mongodb
 * Connection Options: https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/#std-label-node-connection-options
 * MongoDB sets my database to 'test' automatically. How to change it?: https://stackoverflow.com/questions/61302342/mongodb-sets-my-database-to-test-automatically-how-to-change-it
 */