import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';

import { AuthFormComponent } from './elements/auth/auth-form/auth-form.component';
import { AuthModalComponent } from './elements/auth/auth-modal/auth-modal.component';
import { LanguageSelectorComponent } from './elements/language-selector/language-selector.component';
import { ReadonlyFieldComponent } from './elements/readonly-field/readonly-field.component';
import { ReadonlyFormComponent } from './form/readonly-form/readonly-form.component';
import { InfoGridComponent } from './grid/info-grid/info-grid.component';
import { ReadonlyScreenComponent } from './screens/readonly-screen/readonly-screen.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

const components = [
  InfoGridComponent,
  ReadonlyScreenComponent,
  ReadonlyFieldComponent,
  ReadonlyFormComponent,
  LanguageSelectorComponent,
  AuthFormComponent,
  AuthModalComponent,
];

@NgModule({
  declarations: [...components, SafeHtmlPipe],
  imports: [CommonModule, ModalModule, BsDropdownModule, FormsModule],
  exports: components,
})
export class UiModule {}
