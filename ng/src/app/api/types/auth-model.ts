export interface AuthModel {
  userNameOrEmailAddress: string;
  password: string;
  rememberClient: boolean;
}

export interface AuthResultModel {
  accessToken: string;
  encryptedAccessToken: string;
  expireInSeconds: number;
  userId: number;
}

export interface ExternalAuthResultModel {
  accessToken: string;
  encryptedAccessToken: string;
  expireInSeconds: number;
  waitingForActivation: boolean;
}

export interface ExternalLoginProviderInfoModel {
  name: string;
  clientId: string;
}
