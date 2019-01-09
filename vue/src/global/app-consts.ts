const baseUrl = 'http://localhost:21021';
const appUrl = baseUrl + '/api/services/app';
const getScriptsUrl = baseUrl + '/AbpScripts/GetScripts';
export const AppConsts = {
  baseUrl,
  appUrl,
  getScriptsUrl,
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
