import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiTokenAuthService } from '../api/services/api-token-auth.service';
import { LocalStorage, SessionStorage } from 'ngx-store';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ServerResponse } from '../api/types/responses';
import { AuthResultModel } from '../api/types/auth-model';
import { JwtTokenService } from './jwt-token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _claims?: {};

  constructor(
    protected api: ApiTokenAuthService,
    protected jwtHelper: JwtHelperService,
    protected jwtTokenService: JwtTokenService,
  ) {}

  get claims(): {} {
    return this._claims;
  }

  get jwtToken(): string | null {
    return this.jwtTokenService.getToken();
  }

  get isAuthenticated(): boolean {
    return !!this.jwtToken;
  }

  authenticate(input: {
    username: string;
    password: string;
    rememberMe?: boolean;
  }): Observable<ServerResponse<AuthResultModel>> {
    return this.api
      .authenticate({
        userNameOrEmailAddress: input.username,
        password: input.password,
        rememberClient: input.rememberMe,
      })
      .pipe(
        tap(r => {
          this.jwtTokenService.setToken(r.result.accessToken, input.rememberMe);
          this._claims = this.jwtHelper.decodeToken(r.result.accessToken);
        }),
      );
  }

  unauthenticate() {
    this.jwtTokenService.clearToken();
    this._claims = null;
  }
}
