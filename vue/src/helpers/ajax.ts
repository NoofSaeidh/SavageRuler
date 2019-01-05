import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios';
import { AppConsts } from '../global/app-consts';

export class Ajax {
  public axios: AxiosInstance;
  constructor() {
    this.axios = axios.create({
      baseURL: AppConsts.baseUri,
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

  public requestApp<T = any>(
    actionUrl: string,
    config?: AxiosRequestConfig,
  ): AxiosPromise<T> {
    if (config === undefined) {
      config = {};
    }
    config.url = AppConsts.appUri + actionUrl;
    return this.axios.request<T>(config);
  }
}

const ajax = new Ajax();

export default ajax;
