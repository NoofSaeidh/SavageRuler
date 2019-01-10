import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios';
import { AppConsts } from '@/global/app-consts';
import { ServerReponse, ServerReponseList } from '@/types/server';

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
    this.axios.interceptors.request.use(
      config => {
        // if (!!abp.auth.getToken()) {
        //   config.headers.common.Authorization = 'Bearer ' + abp.auth.getToken();
        // }
        // config.headers.common['.AspNetCore.Culture'] = abp.utils.getCookieValue(
        //   'Abp.Localization.CultureName',
        // );
        // config.headers.common[
        //   'Abp.TenantId'
        // ] = abp.multiTenancy.getTenantIdCookie();
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );
    //   const vm = new Vue({});
    //       this.ajax.interceptors.response.use(
    //         respon => {
    //           return respon;
    //         },
    //         error => {
    //           // todo: modal

    //           // if (
    //           //   !!error.response &&
    //           //   !!error.response.data.error &&
    //           //   !!error.response.data.error.message &&
    //           //   error.response.data.error.details
    //           // ) {
    //           //   vm.$Modal.error({
    //           //     title: error.response.data.error.message,
    //           //     content: error.response.data.error.details,
    //           //   });
    //           // } else if (
    //           //   !!error.response &&
    //           //   !!error.response.data.error &&
    //           //   !!error.response.data.error.message
    //           // ) {
    //           //   vm.$Modal.error({
    //           //     title: abp.localization.localize('LoginFailed'),
    //           //     content: error.response.data.error.message,
    //           //   });
    //           // } else if (!error.response) {
    //           //   vm.$Modal.error(abp.localization.localize('UnknownError'));
    //           // }
    //           setTimeout(() => {
    //             //   vm.$Message.destroy();
    //           }, 1000);
    //           return Promise.reject(error);
    //         },
  }

  requestBase<T>(
    url: string,
    params?: any,
    config?: (config: AxiosRequestConfig) => void,
  ): AxiosPromise<T> {
    return this.axios.request<T>(this.getRequestConfig(url, params, config));
  }

 // use requestBase for Axios metadat (AxiosPromise)
  async requestList<T>(
    url: string,
    params?: any,
    config?: (config: AxiosRequestConfig) => void,
  ): Promise<ServerReponseList<T>> {
    return (await this.requestBase<ServerReponseList<T>>(url, params, config)).data;
  }

  async request<T>(
    url: string,
    params?: any,
    config?: (config: AxiosRequestConfig) => void,
  ): Promise<ServerReponse<T>> {
    return (await this.requestBase<ServerReponse<T>>(url, params, config)).data;
  }

  private getRequestConfig(
    url: string,
    params?: any,
    config?: (config: AxiosRequestConfig) => void,
  ): AxiosRequestConfig {
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
