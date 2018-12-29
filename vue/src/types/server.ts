export interface ServerReponse<T> {
  result: T;
  targetUrl: string | null;
  success: boolean;
  error: string | null;
  unAuthorizedRequest: boolean;
}

export interface ServerReponseList<T> extends ServerReponse<ServerList<T>> {
  result: ServerList<T>;
}

export interface ServerList<T> {
  totalCount: number;
  items: T[];
}
