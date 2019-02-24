import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { ApiDynamicService } from 'src/app/api/services/api-dynamic.service';
import { AuthService } from 'src/app/auth/auth.service';

export type AuthState = 'NONE' | 'SUCCESS' | 'ERROR';

@Component({
  selector: 'sr-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit {
  // todo: parse error
  error: string;

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
          this.close();
        },
        e => {
          this.error = JSON.stringify(e);
        },
      );
  }

  close() {
    this.closed.emit();
  }
}
