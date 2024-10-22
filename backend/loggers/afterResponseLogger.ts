import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import moment from 'moment';
dotenv.config()
const readableTimestampFormat = winston.format((info) => {
  info.readableTimestamp = moment(info.timestamp).format('DD-MM-YYYY HH:mm:ss'); // Add the readable timestamp
  return info;
});
const httpLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    readableTimestampFormat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    // Daily rotate file transport
    new DailyRotateFile({
      filename: 'logs/http-response-%DATE%.log',  // Log file name pattern
      datePattern: 'YYYY-MM-DD',                // Rotate logs daily
      zippedArchive: true,                      // Compress old logs
      maxSize: '20m',                           // Maximum log file size before rotation
      maxFiles: '7d',                          // Keep logs for 14 days
    }),
  ]
});

// IF: in development phase --> 
if (process.env.NODE_ENV !== 'production') {
  let alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
      all:true
    }),
    winston.format.label({
      label:'[LOGGER]'
    }),
    winston.format.timestamp({
      format:"DD-MM-YY HH:mm:ss"
    }),
    winston.format.printf(
      info => `${info.label} ${info.timestamp} ${info.level} : ${info.message}`
    ),
  );
  httpLogger.add(new winston.transports.Console({
    format: winston.format.combine(
      alignColorsAndTime
    )
  }));
}

export default httpLogger
