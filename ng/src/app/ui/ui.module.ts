import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';

import { AuthFormComponent } from './elements/auth/auth-form/auth-form.component';
import { AuthModalComponent } from './elements/auth/auth-modal/auth-modal.component';
import { LanguageSelectorComponent } from './elements/language-selector/language-selector.component';
import { ReadonlyFieldComponent } from './elements/readonly-field/readonly-field.component';
import { EditFormComponent } from './forms/edit-form/edit-form.component';
import { ReadonlyFormComponent } from './forms/readonly-form/readonly-form.component';
import { InfoGridComponent } from './grid/info-grid/info-grid.component';
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
];

@NgModule({
  declarations: [...components, SafeHtmlPipe, EditFormComponent],
  imports: [CommonModule, ModalModule, BsDropdownModule, FormsModule, ReactiveFormsModule],
  exports: components,
})
export class UiModule {}
