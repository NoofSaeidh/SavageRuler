import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { ApiLocalizationDescriptor } from '../types/api-localization-descriptor';

export const apiLocalizationUrl = {
  controller: environment.appUrl + '/api',
};

@Injectable({
  providedIn: 'root',
})
export class ApiLocalizationService extends ApiService {
  constructor(http: HttpClient, descriptor: ApiLocalizationDescriptor) {
    super(http, descriptor);
  }
}
