import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PowersComponent } from './powers/powers.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [PowersComponent, DashboardComponent],
  imports: [
    CommonModule
  ],
})
export class ViewsModule { }
