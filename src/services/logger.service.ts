/* eslint-disable no-console */

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

// Define a type for valid log parameters
type LogParam =
  | string
  | number
  | boolean
  | object
  | Error
  | null
  | undefined
  | unknown;

export class Logger {
  private static formatMessage(
    level: LogLevel,
    message: string,
    ...optionalParams: LogParam[]
  ): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message} ${optionalParams
      .map((p) => JSON.stringify(p))
      .join(' ')}`;
  }

  static info(message: string, ...optionalParams: LogParam[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        this.formatMessage(LogLevel.INFO, message, ...optionalParams)
      );
    }
  }

  static warn(message: string, ...optionalParams: LogParam[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        this.formatMessage(LogLevel.WARN, message, ...optionalParams)
      );
    }
  }

  static error(message: string, ...optionalParams: LogParam[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        this.formatMessage(LogLevel.ERROR, message, ...optionalParams)
      );
    }
  }

  static debug(message: string, ...optionalParams: LogParam[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(
        this.formatMessage(LogLevel.DEBUG, message, ...optionalParams)
      );
    }
  }
}
