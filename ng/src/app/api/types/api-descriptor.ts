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

  public getUrl(
    request: keyof ApiUrls,
    extras?: { query?: {}; shortPath?: boolean },
  ): string {
    let url = this._urls[request];
    if (!url) {
      throw new Error(`Current descriptor doesn't have ${request} url.`);
    }
    url = extras && extras.shortPath ? url : this.baseUrl + url;
    if (extras && extras.query) {
      url += this.buildQuery(extras.query);
    }
    return url;
  }

  public buildQuery(query: {}): string {
    let result: string = '?';
    for (const [key, value] of Object.entries(query)) {
      result += `${key}=${value}`;
    }
    return result;
  }
}
