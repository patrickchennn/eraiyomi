import mongoose from 'mongoose'
import dbLogger from '../loggers/dbLogger.js';


const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI as string
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    dbLogger.info(`\r[database] MongoDB Connected to: ${conn.connection.host}:${conn.connection.port}, database name: ${conn.connection.name}`);
  } 
  catch (error) {
    // @ts-ignore
    dbLogger.error(`[database]: Connection failed with error: ${error.message}`);

    dbLogger.error(`Given URI: ${MONGODB_URI}`);
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