const baseUrl = 'http://localhost:21021';
const appUrl = baseUrl + '/api/services/app';
export const AppConsts = {
  baseUrl,
  appUrl,
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
