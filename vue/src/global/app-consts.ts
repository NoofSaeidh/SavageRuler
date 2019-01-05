const baseUri = 'http://localhost:21021';
const appUri = baseUri + '/api/services/app';
export const AppConsts = {
  baseUri,
  appUri,
  userManagement: {
    defaultAdminUserName: 'admin',
  },
  localization: {
    defaultLocalizationSourceName: 'SavageRuler',
  },
  authorization: {
    encrptedAuthTokenName: 'enc_auth_token',
  },
};
