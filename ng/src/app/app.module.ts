import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PowersModule } from './powers/powers.module';
import { UiModule } from './ui/ui.module';

@NgModule({
  declarations: [AppComponent, DashboardComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    PowersModule,
    HttpClientModule,
    UiModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
