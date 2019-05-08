import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { parseServerError } from 'src/app/api/operators/parse-error';
import { StringHelper } from 'src/app/helpers/string-helper';

export type AuthState = 'NONE' | 'SUCCESS' | 'ERROR';

@Component({
  selector: 'sr-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit {
  error: string;

  loading: boolean = false;

  model: { username: string; password: string; rememberMe: boolean } = {
    username: '',
    password: '',
    rememberMe: false,
  };

  @Output() closed = new EventEmitter();

  constructor(protected auth: AuthService) {}

  ngOnInit() {}

  onSubmit() {
    this.loading = true;
    this.auth
      .authenticate(this.model)
      .pipe(first())
      .subscribe(
        r => {
          this.close();
        },
        e => {
          const se = parseServerError(e);
          if (se) {
            this.error = StringHelper.toHtmlWhitespaces(
              se.details || se.message,
            );
          } else {
            this.error = JSON.stringify(e);
          }
          this.loading = false;
        },
      );
  }

  close() {
    this.closed.emit();
  }
}
