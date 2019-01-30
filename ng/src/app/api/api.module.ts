import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { POWER_API_DESCRIPTOR, powerApiDescriptor } from './entities/powers/descriptors/power-api-descriptor';
import { ApiService } from './services/api.service';
import { ApiCrudService } from './services/api-crud.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {provide: POWER_API_DESCRIPTOR, useValue: powerApiDescriptor}
  ]
})
export class ApiModule { }
