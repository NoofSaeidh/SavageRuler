export interface Dictionary<T = any> {
  [key: string]: T;
}

export interface Pair<T = any> {
  key: string;
  value: T;
}