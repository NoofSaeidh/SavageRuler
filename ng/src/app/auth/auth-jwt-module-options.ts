import {
  JwtModuleOptions,
  JWT_OPTIONS,
  JwtHelperService,
} from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { ApiTokenAuthService } from '../api/services/api-token-auth.service';
import { JwtTokenService } from './jwt-token.service';

export function jwtOptionsFactory(jwt: JwtTokenService) {
  console.log(jwt);

  return {
    tokenGetter: () => {
      return jwt.getToken();
    },
    whitelistedDomains: [environment.appDomain],
  };
}

@Injectable({ providedIn: 'root' })
export class AuthDump {
  jwtToken = 'token';
}

// config?: {
//   tokenGetter?: () => string | null | Promise<string | null>;
//   headerName?: string;
//   authScheme?: string;
//   whitelistedDomains?: Array<string | RegExp>;
//   blacklistedRoutes?: Array<string | RegExp>;
//   throwNoTokenError?: boolean;
//   skipWhenExpired?: boolean;
// };

export const authJwtModuleOptions: JwtModuleOptions = {
  jwtOptionsProvider: {
    provide: JWT_OPTIONS,
    useFactory: jwtOptionsFactory,
    deps: [JwtTokenService],
  },
};
