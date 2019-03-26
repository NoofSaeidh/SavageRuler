import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServerError } from 'src/app/api/types/responses';

import { ErrorHandlerService } from '../error-handler.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { parseServerError } from 'src/app/api/operators/parse-error';

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
    console.log(this.rawError);
    // should injected by BsModalService
    if (this.rawError) {
      this.serverError = parseServerError(this.rawError);
    }
    console.log(this.serverError);
  }
}
