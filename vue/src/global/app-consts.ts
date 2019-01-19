import { baseURL } from '@/base-url';
const appUrl = '/api/services/app';
const getScriptsUrl = '/AbpScripts/GetScripts';
export const AppConsts = {
  baseUrl: baseURL,
  appUrl,
  appUrlFull: baseURL + appUrl, // perhaps should rm
  getScriptsUrl,
  getAppScriptsUrlFull: baseURL + getScriptsUrl, // perhaps should rm
  userManagement: {
    defaultAdminUserName: 'admin',
  },
  localization: {
    defaultLocalizationSourceName: 'SavageRuler',
    defaultLanguage: 'ru', // should be handle by abp (coockie, browser, e.t.c.), but in this app only ru is required (now)
  },
  authorization: {
    encrptedAuthTokenName: 'enc_auth_token',
  },
};
