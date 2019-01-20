import { DefaultLogger } from './default-logger';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface ILogger {
  log(level: LogLevel, message: string, ...args: string[]): void;
  debug(message: string, ...args: string[]): void;
  info(message: string, ...args: string[]): void;
  warn(message: string, ...args: string[]): void;
  error(message: string, ...args: string[]): void;
  fatal(message: string, ...args: string[]): void;
}

export const logger = new DefaultLogger();
