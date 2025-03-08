import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import moment from 'moment';
import dotenv from 'dotenv';
dotenv.config();

const readableTimestampFormat = winston.format((info) => {
  info.readableTimestamp = moment(info.timestamp).format('DD-MM-YYYY HH:mm:ss');
  return info;
});

// Define transports based on environment
const transports: winston.transport[] = [new winston.transports.Console()];

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
  transports.push(
    new DailyRotateFile({
      filename: 'logs/http-response-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
    })
  );
}

// Define the base format (used in all environments)
const baseFormat = winston.format.combine(
  winston.format.timestamp(),
  readableTimestampFormat(),
  winston.format.json()
);

// Define the development format
const devFormat = winston.format.combine(
  readableTimestampFormat(),
  winston.format.printf(({ level, readableTimestamp, ...rest }) => {
    return `[${level}] ${readableTimestamp} : ${JSON.stringify(rest, null, 2)}`;
  }),
  winston.format.colorize({ all: true })
);

// Create the logger
const httpLogger = winston.createLogger({
  format: process.env.NODE_ENV === "development" ? devFormat : baseFormat,
  transports,
});

export default httpLogger;