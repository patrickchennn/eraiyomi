import moment from "moment";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Define custom colors for different log levels
winston.addColors({
  error: 'red',    // Red for errors
  warn: 'yellow',  // Yellow/orange for warnings
  info: 'green',   // Green for info
  http: 'magenta', // Magenta for HTTP requests (if used)
  debug: 'blue',   // Blue for debug
});

const readableTimestampFormat = winston.format((info) => {
  info.readableTimestamp = moment(info.timestamp).format('DD-MM-YYYY HH:mm:ss'); // Add the readable timestamp
  return info;
});

// Winston logger for both success and error logs
const indexLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    readableTimestampFormat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: 'logs/index-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
    }),
  ],
});

// IF: in development phase --> Add color formatting for console output
if (process.env.NODE_ENV !== 'production') {
  indexLogger.format = winston.format.combine(
    readableTimestampFormat(),
    winston.format.printf(({ level, readableTimestamp, ...rest }) => {
      // Log the entire rest of the properties in JSON format
      return `[${level}] ${readableTimestamp} : ${JSON.stringify(rest)}`;
    }),
    winston.format.colorize({ all: true }),  // Colorize all log levels

  );
}

export default indexLogger