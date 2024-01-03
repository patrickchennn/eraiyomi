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