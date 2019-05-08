import { Injectable } from '@angular/core';
import { LocalStorage, SessionStorage } from 'ngx-store';

// this class need only for correct working jwt http interceptor
@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {
  @LocalStorage('jwt-token')
  private _jwtToken: string = null;
  @SessionStorage('jwt-token-session')
  private _jwtSessionToken: string = null;

  getToken(): string | null {
    return this._jwtSessionToken || this._jwtToken || null;
  }

  setToken(token: string, remember?: boolean) {
    if (remember) {
      this._jwtToken = token;
    } else {
      this._jwtSessionToken = token;
    }
  }

  clearToken() {
    this._jwtSessionToken = null;
    this._jwtToken = null;
  }
}
