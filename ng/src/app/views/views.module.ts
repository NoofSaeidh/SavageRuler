import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PowersComponent } from './powers/powers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApiModule } from '../api/api.module';

@NgModule({
  declarations: [PowersComponent, DashboardComponent],
  imports: [
    CommonModule,
    ApiModule
  ],
})
export class ViewsModule { }
