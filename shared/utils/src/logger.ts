import winston from 'winston';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  HTTP = 'http',
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'iso-8601' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

export const createLogger = (
  service: string,
  level: LogLevel = LogLevel.INFO
): Logger => {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || level,
    format: logFormat,
    defaultMeta: { service },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.printf(
            ({ timestamp, level, message, service, method, url, statusCode, durationMs, ...meta }) => {
              const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : '';
              return `${timestamp} [${service}] ${level}: ${message} ${metaStr}`;
            }
          )
        ),
      }),
    ],
  });
};

// Export the winston Logger type
export type Logger = winston.Logger;
