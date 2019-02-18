import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sr-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit {
  model: { username: string; password: string } = {username: '', password: ''};

  constructor() {}

  ngOnInit() {}

  get debug() {
    return JSON.stringify(this.model);
  }
}
