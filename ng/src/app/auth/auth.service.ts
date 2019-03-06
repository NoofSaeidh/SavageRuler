import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiTokenAuthService } from '../api/services/api-token-auth.service';
import { LocalStorage, SessionStorage } from 'ngx-store';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ServerResponse } from '../api/types/responses';
import { AuthResultModel } from '../api/types/auth-model';
import { JwtTokenService } from './jwt-token.service';

export interface AuthState {
  isAuthenticated: boolean;
  username?: string;
  permissions?: [];
  claims?: {};
}

const tokenDataNames = {
  username: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  permissions: 'Abp.Permissions',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _state$: BehaviorSubject<AuthState>;

  constructor(
    protected api: ApiTokenAuthService,
    protected jwtHelper: JwtHelperService,
    protected jwtTokenService: JwtTokenService,
  ) {
    this._state$ = new BehaviorSubject<AuthState>({ isAuthenticated: false });
    const token = jwtTokenService.getToken();
    if (token) {
      this._setStateFromToken(jwtTokenService.getToken());
    }
  }

  get claims(): {} | null {
    return this._state$.value.claims || null;
  }

  get permissions(): [] | null {
    return this._state$.value.permissions || null;
  }

  get jwtToken(): string | null {
    return this.jwtTokenService.getToken();
  }

  get isAuthenticated(): boolean {
    return this._state$.value.isAuthenticated;
  }

  get state$(): Observable<AuthState> {
    return this._state$.asObservable();
  }

  private _setStateFromToken(token: string) {
    const claims = this.jwtHelper.decodeToken(token);
    this._state$.next({
      isAuthenticated: true,
      claims,
      username: claims[tokenDataNames.username],
      permissions: JSON.parse(claims[tokenDataNames.permissions]),
    });
  }

  // reset state to current token data
  resetState(): void {
    this._setStateFromToken(this.jwtTokenService.getToken());
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
          this._setStateFromToken(r.result.accessToken);
        }),
      );
  }

  unauthenticate(): void {
    this.jwtTokenService.clearToken();
    this._state$.next({ isAuthenticated: false });
  }
}
