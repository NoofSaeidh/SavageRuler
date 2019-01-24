import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PowersComponent } from './powers.component';
import { PowersService } from '../api/powers/powers.service';

@NgModule({
  declarations: [PowersComponent],
  imports: [
    CommonModule
  ],
  providers: [
    PowersService
  ]
})
export class PowersModule { }
