import { DefaultLogger } from './default-logger';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface ILogger {
  log(level: LogLevel, message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  fatal(message: string, ...args: any[]): void;
}

export const logger = new DefaultLogger();
