import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PowersModule } from './powers/powers.module';

@NgModule({
  declarations: [AppComponent, DashboardComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    PowersModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
