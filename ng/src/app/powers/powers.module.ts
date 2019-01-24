import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PowersComponent } from './powers.component';
import { PowersService } from '../api/powers/powers.service';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [PowersComponent],
  imports: [
    CommonModule,
    MDBBootstrapModule.forRoot(),
  ],
  providers: [
    PowersService
  ]
})
export class PowersModule { }
