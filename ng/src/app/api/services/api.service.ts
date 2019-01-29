import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiDescriptor, ApiUrls } from '../types/api-descriptor';
import { Observable } from 'rxjs';
import { ServerReponseList, ServerReponse, ServerList } from '../types/responses';
import { map } from 'rxjs/operators';
import { IEntity, EntityKey } from 'src/app/types/api/ientity';


@Injectable({
  providedIn: 'root',
})
export abstract class ApiService {
 // todo: interceptors here?
}
