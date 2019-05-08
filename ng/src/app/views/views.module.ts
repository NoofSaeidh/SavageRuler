import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PowersComponent } from './powers/powers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UiModule } from '../ui/ui.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [PowersComponent, DashboardComponent, LoginComponent],
  imports: [
    CommonModule,
    UiModule
  ],
})
export class ViewsModule { }
