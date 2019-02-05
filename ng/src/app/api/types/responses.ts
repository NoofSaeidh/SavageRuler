export interface ServerResponse<T = any> {
  result: T | null;
  targetUrl: string | null;
  success: boolean;
  error: ServerError | null;
  unAuthorizedRequest: boolean;
}

export interface ServerResponseList<T = any> extends ServerResponse<ServerList<T>> {
  result: ServerList<T>;
}

export interface ServerList<T> {
  totalCount: number;
  items: T[];
}

export interface ServerError {
  message: string;
  code: number;
  details?: string;
  validationErrors?: string;
}
