import { environment } from 'src/environments/environment';

export interface ApiUrls {
  getAll?: string;
  get?: string;
  create?: string;
  update?: string;
  delete?: string;
}

export class ApiDescriptor<T> {
  public readonly baseUrl: string = environment.appUrl;

  // todo: add checkings - now all urls must start with '/'
  constructor(private _urls: ApiUrls) {}

  public hasUrl(request: keyof ApiUrls): boolean {
    return !!this._urls[request];
  }

  public getUrl(request: keyof ApiUrls, fullPath: boolean = true): string {
    const url = this._urls[request];
    if (!url) {
      throw new Error(`Current descriptor doesn't have ${request} url.`);
    }
    return fullPath ? this.baseUrl + url : url;
  }
}
