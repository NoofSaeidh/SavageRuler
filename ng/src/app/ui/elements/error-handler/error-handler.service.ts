import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ServerError } from 'src/app/api/types/responses';
import { filter, map } from 'rxjs/operators';
import { parseServerError } from 'src/app/api/operators/parse-error';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private _error = new Subject<any>();
  public readonly error$: Observable<any> = this._error.asObservable();
  public readonly serverError$: Observable<ServerError> = this.error$.pipe(
    map(e => parseServerError(e)),
    filter(e => !!e),
  );

  constructor() {}

  addError(error: any) {
    this._error.next(error);
  }
}
