import { InjectionToken, Injectable } from '@angular/core';
import { ApiCrudDescriptor } from 'src/app/api/types/api-crud-descriptor';

export const POWER_API_DESCRIPTOR = new InjectionToken<ApiCrudDescriptor>(
  'Powers api descriptor',
);

export const powerApiDescriptor = new ApiCrudDescriptor('Power');
