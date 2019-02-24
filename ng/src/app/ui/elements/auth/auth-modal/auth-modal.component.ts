import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'sr-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
})
export class AuthModalComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(
    private modalService: BsModalService,
    private auth: AuthService,
  ) {}

  ngOnInit() {}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  get isAuthenticated(): boolean {
    return this.auth.isAuthenticated;
  }

  unauthenticate() {
    this.auth.unauthenticate();
  }
}
