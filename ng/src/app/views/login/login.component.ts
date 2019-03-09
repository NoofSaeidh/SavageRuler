import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, AuthState } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { LocalizationDictionary } from 'src/app/localization/localization-dictionary';

@Component({
  selector: 'sr-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  state: AuthState;
  private _subscription: Subscription;
  constructor(public L: LocalizationDictionary, private auth: AuthService) {}

  logout() {
    this.auth.unauthenticate();
  }

  ngOnInit() {
    this._subscription = this.auth.state$.subscribe(r => (this.state = r));
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
