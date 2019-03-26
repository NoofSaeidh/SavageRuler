import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { parseServerError } from 'src/app/api/operators/parse-error';
import { ServerError } from 'src/app/api/types/responses';

@Component({
  selector: 'sr-error-handler',
  templateUrl: './error-handler.component.html',
  styleUrls: ['./error-handler.component.scss'],
})
export class ErrorHandlerComponent implements OnInit {
  rawError: any;
  serverError: ServerError | null;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
    // should injected by BsModalService
    if (this.rawError) {
      this.serverError = parseServerError(this.rawError);
    }
  }
}
