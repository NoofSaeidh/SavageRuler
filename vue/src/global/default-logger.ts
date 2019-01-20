import { ILogger, LogLevel } from './logger';
import { stringHelper } from '@/helpers/string-helper';

// tslint:disable:no-console
export class DefaultLogger implements ILogger {
  log(level: LogLevel, message: string, ...args: any[]) {
    // todo: create helper for env
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    let logMethod: (arg: any) => void;
    switch (level) {
      case 'DEBUG':
      case 'INFO':
        logMethod = console.log;
        break;
      case 'WARN':
        logMethod = console.warn;
        break;
      case 'ERROR':
      case 'FATAL':
        logMethod = console.error;
        break;
      default:
        return;
    }

    const resMessage = level + ': ' + stringHelper.format(message, args);
    logMethod(resMessage);
  }

  debug(message: string, ...args: any[]) {
    this.log('DEBUG', message, args);
  }
  info(message: string, ...args: any[]) {
    this.log('INFO', message, args);
  }
  warn(message: string, ...args: any[]) {
    this.log('WARN', message, args);
  }
  error(message: string, ...args: any[]) {
    this.log('ERROR', message, args);
  }
  fatal(message: string, ...args: any[]) {
    this.log('FATAL', message, args);
  }
}
