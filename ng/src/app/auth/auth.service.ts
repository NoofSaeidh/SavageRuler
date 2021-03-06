import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiTokenAuthService } from '../api/services/api-token-auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ServerResponse } from '../api/types/responses';
import { AuthResultModel } from '../api/types/auth-model';
import { JwtTokenService } from './jwt-token.service';

export interface AuthState {
  isAuthenticated: boolean;
  username?: string;
  permissions?: string[];
  // claims?: {};
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
    this.resetState();
  }

  // get claims(): {} | null {
  //   return this._state$.value.claims || null;
  // }

  get permissions(): string[] | null {
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

  isGranted(...permissions: string[]): boolean {
    return this._isGranted(this._state$.value, permissions);
  }

  isGranted$(...permissions: string[]): Observable<boolean> {
    return this.state$.pipe(
      map(value => this._isGranted(value, permissions))
    );
  }

  private _isGranted(state: AuthState, permissions: string[]): boolean {
    if (!permissions || permissions.length === 0) {
      return true;
    }
    if (!state.permissions) {
      return false;
    }
    for (const p of permissions) {
      if (p && state.permissions.indexOf(p) < 0) {
        return false;
      }
    }
    return true;
  }

  private _setStateFromToken(token?: string) {
    if (token) {
      const claims = this.jwtHelper.decodeToken(token);
      this._state$.next({
        isAuthenticated: true,
        // claims,
        username: claims[tokenDataNames.username],
        permissions: JSON.parse(claims[tokenDataNames.permissions]),
      });
    } else if (this._state$.value.isAuthenticated) {
      this._state$.next({ isAuthenticated: false });
    }
  }

  // reset state to current token data (if token was set somewhere else)
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
