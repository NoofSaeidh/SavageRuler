import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { EventModalService } from '../../events/modal/event-modal.service';
import { ErrorHandlerComponent } from './component/error-handler.component';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private eventModal: EventModalService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        error: err => {
          if (err instanceof HttpErrorResponse) {
            this.eventModal.showModal(ErrorHandlerComponent, {
              initialState: {
                rawError: err,
              },
            });
            // do error handling here
          }
        },
      }),
    );
  }
}
