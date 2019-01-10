import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios';
import { AppConsts } from '@/global/app-consts';
import { ServerReponse, ServerReponseList } from '@/types/server';

export class Ajax {
  public readonly axios: AxiosInstance;
  constructor() {
    this.axios = axios.create({
      baseURL: AppConsts.baseUrl,
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

  public requestAppBase<T = any>(
    actionUrl: string,
    params?: any,
    config?: (config: AxiosRequestConfig) => void,
  ): AxiosPromise<T> {
    return this.axios.request<T>(this.getAppConfig(actionUrl, params, config));
  }

  public requestAppList<T>(
    actionUrl: string,
    params?: any,
    config?: (config: AxiosRequestConfig) => void,
  ): AxiosPromise<ServerReponseList<T>> {
    return this.axios.request<ServerReponseList<T>>(
      this.getAppConfig(actionUrl, params, config),
    );
  }

  public requestApp<T>(
    actionUrl: string,
    params?: any,
    config?: (config: AxiosRequestConfig) => void,
  ): AxiosPromise<ServerReponse<T>> {
    return this.axios.request<ServerReponse<T>>(
      this.getAppConfig(actionUrl, params, config),
    );
  }

  private getRequestConfig(
    baseUrl: string,
    url: string,
    params?: any,
    config?: (config: AxiosRequestConfig) => void,
  ): AxiosRequestConfig {
    const request: AxiosRequestConfig = {};
    request.url = baseUrl + url;
    request.params = params;
    if (config) {
      config(request);
    }
    return request;
  }

  private getAppConfig(
    url: string,
    params?: any,
    config?: (config: AxiosRequestConfig) => void,
  ): AxiosRequestConfig {
    return this.getRequestConfig(AppConsts.appUrl, url, params, config);
  }
}

const ajax = new Ajax();

export default ajax;
