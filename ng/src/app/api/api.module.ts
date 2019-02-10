import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  POWER_API_DESCRIPTOR,
  powerApiDescriptor,
} from './entities/powers/descriptors/power-api-descriptor';
import { ApiLocalizationDescriptor } from './types/api-localization-descriptor';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    { provide: POWER_API_DESCRIPTOR, useValue: powerApiDescriptor },
    ApiLocalizationDescriptor,
  ],
})
export class ApiModule {}
