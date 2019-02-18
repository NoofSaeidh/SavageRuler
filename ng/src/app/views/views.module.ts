import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PowersComponent } from './powers/powers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UiModule } from '../ui/ui.module';

@NgModule({
  declarations: [PowersComponent, DashboardComponent],
  imports: [
    CommonModule,
    UiModule
  ],
})
export class ViewsModule { }
