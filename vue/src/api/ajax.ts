import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios';
import { AppConsts } from '@/global/app-consts';
import { ServerReponse, ServerReponseList, ServerError } from '@/types/server';

export class Ajax {
  readonly axios: AxiosInstance;
  readonly baseUrl: string;
  constructor(addUrl?: string) {
    // todo: make this helper
    this.baseUrl = [AppConsts.baseUrl, addUrl].join('');
    this.axios = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
    });
    // this.axios.interceptors.request.use(config => {
    //   // if (!!abp.auth.getToken()) {
    //   //   config.headers.common.Authorization = 'Bearer ' + abp.auth.getToken();
    //   // }
    //   // config.headers.common['.AspNetCore.Culture'] = abp.utils.getCookieValue(
    //   //   'Abp.Localization.CultureName',
    //   // );
    //   // config.headers.common[
    //   //   'Abp.TenantId'
    //   // ] = abp.multiTenancy.getTenantIdCookie();
    //   return config;
    // });
    // this.axios.interceptors.response.use(
    //   response => response,
    //   error => {
    //     if (!!error.response) {
    //       const data = error.response.data as ServerReponse;
    //       if (!!data) {
    //         const sError = data.error;
    //         if (!!sError) {
    //           vue.$modal.show('dialog', {
    //             // todo: localize
    //             title: 'Error!!!',
    //             text: sError.message,
    //             buttons: [
    //               {
    //                 title: 'Cancel',
    //                 // todo: add goback
    //                 // handler: () => vue.$router.back(),
    //               },
    //             ],
    //           });
    //           // todo: add error details somehow
    //         }
    //       }
    //       // todo: handle other
    //     }
    //     // setTimeout(() => {
    //     //   vue.$modal.hide('dialog');
    //     // }, 1000);
    //     return Promise.reject(error);
    //   },
    // );
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
