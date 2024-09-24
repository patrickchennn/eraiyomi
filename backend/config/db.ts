import mongoose from 'mongoose'
import chalk from 'chalk'


const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI as string
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(
      chalk.green(
      `[database] MongoDB Connected to: ${conn.connection.host}:${conn.connection.port}, database name:${conn.connection.name}`
      )
    )
  } catch (error) {
    console.log(chalk.red("[database]: ",error))
    console.log("detail: ",error)
    console.log("given uri",MONGODB_URI)
    process.exit(1)
  }
}

export default connectDB

/** Docs
 * Main docs for Node.JS driver: https://www.mongodb.com/docs/drivers/node/current/quick-start/
 * Connection Guide: https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connect/#std-label-node-connect-to-mongodb
 * Connection Options: https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/#std-label-node-connection-options
 * MongoDB sets my database to 'test' automatically. How to change it?: https://stackoverflow.com/questions/61302342/mongodb-sets-my-database-to-test-automatically-how-to-change-it
 */