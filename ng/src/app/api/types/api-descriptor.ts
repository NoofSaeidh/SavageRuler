import { ApiController, ApiMethod } from './api-interfaces';

export class ApiDescriptor<T extends string | number | symbol = string> {
  protected static normalizeUrl(url: string, addEndSlash?: boolean): string {
    if (!url) {
      return '/';
    }
    let resultUrl;
    if (url.startsWith('/')) {
      resultUrl = url;
    } else {
      resultUrl = '/' + url;
    }
    if (addEndSlash) {
      if (resultUrl.endsWith('/')) {
        return resultUrl;
      }
      return resultUrl + '/';
    }
  }

  constructor(protected controller: ApiController<T>) {}

  hasMethod(name: T): boolean {
    return !!this.controller.methods[name];
  }

  // will throw if not specified
  getMethod(name: T): ApiMethod {
    const result = this.controller.methods[name];
    if (!result) {
      throw new Error(`Specified method: ${name} is not defined.`);
    }
    return result;
  }

  tryGetMethod(name: T): ApiMethod | null {
    return this.controller.methods[name] || null;
  }
}
