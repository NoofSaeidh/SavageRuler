import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';

import { AuthFormComponent } from './elements/auth/auth-form/auth-form.component';
import { AuthModalComponent } from './elements/auth/auth-modal/auth-modal.component';
import { ErrorHandlerComponent } from './elements/error-handler/component/error-handler.component';
import { LanguageSelectorComponent } from './elements/language-selector/language-selector.component';
import { ReadonlyFieldComponent } from './elements/readonly-field/readonly-field.component';
import { EditFormComponent } from './forms/edit-form/edit-form.component';
import { ReadonlyFormComponent } from './forms/readonly-form/readonly-form.component';
import { InfoGridComponent } from './grid/info-grid/info-grid.component';
import { LocalizePipe } from './pipes/localize.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { PrimaryScreenComponent } from './screens/primary-screen/primary-screen.component';

const components = [
  InfoGridComponent,
  PrimaryScreenComponent,
  ReadonlyFieldComponent,
  ReadonlyFormComponent,
  LanguageSelectorComponent,
  AuthFormComponent,
  AuthModalComponent,
  EditFormComponent,
  ErrorHandlerComponent,
  SafeHtmlPipe,
  LocalizePipe,
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    ModalModule,
    BsDropdownModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: components,
  entryComponents: [ErrorHandlerComponent],
})
export class UiModule {}
