import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ApiAuthService } from './../../../../api/services/api-auth.service';

@Component({
  selector: 'sr-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnInit {
  private _debug: any;

  model: { username: string; password: string; rememberMe: boolean } = {
    username: '',
    password: '',
    rememberMe: false
  };

  @Output() closed = new EventEmitter();

  constructor(protected auth: ApiAuthService) {}

  ngOnInit() {}

  onSubmit() {
    console.log(this.auth.login);
    this.auth
      .login({
        userNameOrEmailAddress: this.model.username,
        password: this.model.password,
        rememberClient: this.model.rememberMe
      })
      .subscribe(
        r => {
          console.log(r);
          this._debug = r;
        },
        e => {
          console.log(e);
          // window.alert(e);
        }
      );
    // this.close();
  }

  close() {
    this.closed.emit();
  }

  // todo: rem
  get debug() {
    return this._debug || JSON.stringify(this.model);
  }
}
