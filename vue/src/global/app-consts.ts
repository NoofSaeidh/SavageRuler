const baseUrl = 'http://localhost:21021';
const appUrl = '/api/services/app';
const getScriptsUrl = '/AbpScripts/GetScripts';
export const AppConsts = {
  baseUrl,
  appUrl,
  appUrlFull: baseUrl + appUrl, // perhaps should rm
  getScriptsUrl,
  getAppScriptsUrlFull: baseUrl + getScriptsUrl, // perhaps should rm
  userManagement: {
    defaultAdminUserName: 'admin',
  },
  localization: {
    defaultLocalizationSourceName: 'SavageRuler',
    entityLocalizationPath: '/GetLocalizedProperties',
  },
  authorization: {
    encrptedAuthTokenName: 'enc_auth_token',
  },
};
