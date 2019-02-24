import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ApiTokenAuthService } from '../../../../api/services/api-token-auth.service';
import { ApiDynamicService } from 'src/app/api/services/api-dynamic.service';
import { AuthService } from 'src/app/auth/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'sr-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit {
  private _debug: any;

  model: { username: string; password: string; rememberMe: boolean } = {
    username: '',
    password: '',
    rememberMe: false,
  };

  @Output() closed = new EventEmitter();

  constructor(
    protected auth: AuthService,
    private apiDynamic: ApiDynamicService, // todo: temp
  ) {}

  ngOnInit() {}

  onSubmit() {
    console.log(this.auth.authenticate);
    this.auth
      .authenticate(this.model)
      .pipe(first())
      .subscribe(
        r => {
          console.log(r);
          this._debug = r;
        },
        e => {
          console.log(e);
          this._debug = e;
          // window.alert(e);
        },
      );
    // this.close();
  }

  close() {
    this.closed.emit();
  }

  testAuth() {
    this.apiDynamic
      .makeRequest('/api/services/app/Role/GetAll')
      .subscribe(r => (this._debug = r), e => (this._debug = e));
  }

  // todo: rem
  get debug() {
    return this._debug
      ? 'DEBUG: ' + JSON.stringify(this._debug)
      : 'MODEL: ' + JSON.stringify(this.model);
  }
}
