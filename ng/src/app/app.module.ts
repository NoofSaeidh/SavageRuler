import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule, CollapseModule, BsDropdownModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { WebStorageModule } from 'ngx-store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { ViewsModule } from './views/views.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    HttpClientModule,
    UiModule,
    ViewsModule,
    FormsModule,
    WebStorageModule,
  ],
  providers: [Title],
  bootstrap: [AppComponent],
})
export class AppModule {}
