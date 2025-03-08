import { Request, Response, NextFunction } from 'express';
import httpLogger from '../loggers/afterResponseLogger.js';


const afterResponseLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Listen to the finish event to log when the response has been sent
  res.on('finish', () => {
    const endTime = Date.now();
    const elapsedTime: string = endTime - startTime + "ms";
    // httpLogger.add
    const statCode = res.statusCode

    let logMessage: any = {
      "method": req.method,
      "url": req.originalUrl,
      "httpVersion":req.httpVersion,
      "status":res.statusCode + " " + res.statusMessage,
      elapsedTime,
      headers:req.headers,
      ip:req.ip,
      "x-forwarded-for":req.headers['x-forwarded-for'] || req.socket.remoteAddress
    }

    // `${req.method} ${req.originalUrl} ${req.httpVersion} - ${res.statusCode} ${res.statusMessage} - ${elapsedTime}ms`;


    if(statCode>99 && statCode<400){
      httpLogger.info({...logMessage})
    }
    else if(statCode>399 && statCode<600) {
      httpLogger.error({
        ...logMessage,
        responseMessage:res.locals.errorMessage
      })
    }

  });

  // Proceed to the next middleware or route handler
  next();
};

export default afterResponseLogger;