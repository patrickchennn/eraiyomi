import winston from 'winston';
import chalk from 'chalk';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import moment from 'moment';
dotenv.config()

const readableTimestampFormat = winston.format((info) => {
  info.readableTimestamp = moment(info.timestamp).format('DD-MM-YYYY HH:mm:ss'); // Add the readable timestamp
  return info;
});


// Define custom formats for logging
const loggerFormat = winston.format.printf(({ timestamp, level, message }) => {
  // Colorize log levels for the console
  let coloredLevel = '';
  switch (level) {
    case 'info': coloredLevel = chalk.blue(level.toUpperCase()); break;
    case 'warn': coloredLevel = chalk.yellow(level.toUpperCase()); break;
    case 'error': coloredLevel = chalk.red(level.toUpperCase()); break;
    default: coloredLevel = level.toUpperCase(); break;
  }

  return `${timestamp} [${coloredLevel}]: ${message}`;
});

const dbLogger = winston.createLogger({
  level: 'info', // Default log level
  format: winston.format.combine(
    winston.format.timestamp(),
    readableTimestampFormat(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    
    new DailyRotateFile({
      filename: 'logs/database-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
    }),
  ],
});


// IF: in development phase --> 
// 1. no need to log into file
// 2. color is important in console display
// comment this condition to test the production level of log
if (process.env.NODE_ENV !== 'production') {
  // const console = new winston.transports.Console();
  // dbLogger.remove(console)
  dbLogger.clear()
  dbLogger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.timestamp(),
      loggerFormat
    ),
  }));
}

export default dbLogger;
