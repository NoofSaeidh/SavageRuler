import { ApiDescriptor } from 'src/app/api/types/api-descriptor';
import { ApiDescriptorAppService } from 'src/app/api/types/api-descriptor-app-service';
import { Power } from './power';
import { InjectionToken, Injectable } from '@angular/core';

export const POWER_API_DESCRIPTOR = new InjectionToken<ApiDescriptor<Power>>('Powers api descriptor');

export const powerApiDescriptor: ApiDescriptor<Power> = new ApiDescriptorAppService<Power>('Power');
