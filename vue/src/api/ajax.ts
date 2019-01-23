import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios';
import { AppConsts } from '@/global/app-consts';
import { ServerReponse, ServerReponseList, ServerError } from '@/types/server';

// todo: api descriptor
export class Ajax {
  readonly axios: AxiosInstance;
  readonly baseUrl: string;
  readonly loginAxios: AxiosInstance;

  token?: string;
  constructor(addUrl?: string) {
    // todo: make helper for this?
    this.baseUrl = [AppConsts.baseUrl, addUrl].join('');
    this.axios = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
    });
    // todo: move into api descriptor
    this.loginAxios = axios.create({
      baseURL: [AppConsts.baseUrl, '/api/TokenAuth'].join(''),
      timeout: 30000,
    });
  }

  header?: string;
  async login(user: string, password: string, rememberClient: boolean = true) {
    const result = await this.loginAxios.post('Authenticate', {
      userNameOrEmailAddress: user,
      password,
      rememberClient,
    });
    document.cookie = 'Abp.AuthToken=' + result.data.result.accessToken;
    // this.token = result.data.
  }

  // TODO: remove!!!
  async checkLogin() {
    try {
      const res = await this.requestBase('/api/services/app/User/GetAll');
      window.alert('success: ' + JSON.stringify(res, null, ' '));
    } catch (error) {
      const se = this.tryParseError(error);
      window.alert('error: ' + JSON.stringify(error, null, ' '));
    }
  }

  tryParseError(error: any): ServerError | null {
    if (error && error.response && error.response.data && error.response.data.error) {
      const result = error.response.data.error as ServerError;
      if (result.message) {
        return result;
      }
    }
    return null;
  }

  requestBase<T>(url: string, params?: any, config?: (config: AxiosRequestConfig) => void): AxiosPromise<T> {
    return this.axios.request<T>(this.getRequestConfig(url, params, config));
  }

  // use requestBase for Axios metadat (AxiosPromise)
  async requestList<T>(url: string, params?: any, config?: (config: AxiosRequestConfig) => void): Promise<ServerReponseList<T>> {
    return (await this.requestBase<ServerReponseList<T>>(url, params, config)).data;
  }

  async request<T>(url: string, params?: any, config?: (config: AxiosRequestConfig) => void): Promise<ServerReponse<T>> {
    return (await this.requestBase<ServerReponse<T>>(url, params, config)).data;
  }

  private getRequestConfig(url: string, params?: any, config?: (config: AxiosRequestConfig) => void): AxiosRequestConfig {
    const request: AxiosRequestConfig = {};
    request.url = this.baseUrl + url;
    request.params = params;
    if (config) {
      config(request);
    }
    return request;
  }
}

export const baseAjax = new Ajax();
