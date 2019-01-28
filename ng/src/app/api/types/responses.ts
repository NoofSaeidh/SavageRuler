export interface ServerReponse<T = any> {
  result: T | null;
  targetUrl: string | null;
  success: boolean;
  error: ServerError | null;
  unAuthorizedRequest: boolean;
}

export interface ServerReponseList<T = any> extends ServerReponse<ServerList<T>> {
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
