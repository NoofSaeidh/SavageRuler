import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { ViewDescriptor } from 'src/app/types/descriptors/view-descriptor';
import { Power } from 'src/app/types/api/power';
import { ServerReponseList } from '../descriptors/responses';

@Injectable({
  providedIn: 'root',
})
export class PowersService {
  readonly descriptor: ViewDescriptor<Power>;
  constructor(private _http: HttpClient) {
    this.descriptor = new ViewDescriptor<Power>(
      'Power',
      'name',
      // readForm
      null,
      // infoGrid
      {
        name: { sortable: true },
        book: { sortable: true },
        points: { sortable: true },
        duration: { sortable: true },
        distance: { sortable: true },
        rank: { sortable: true },
      },
    );
  }

  getAll(): Observable<Power[]> {
    // todo: url, error
    return this._http
      .get<ServerReponseList<Power>>(
        'http://localhost:21021/api/services/app/Power/GetAll',
      )
      .pipe(map(value => value.result.items));
  }
}
