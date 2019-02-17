import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule, BsDropdownModule } from 'ngx-bootstrap';
import { InfoGridComponent } from './grid/info-grid/info-grid.component';
import { ReadonlyScreenComponent } from './screens/readonly-screen/readonly-screen.component';
import { ReadonlyFieldComponent } from './elements/readonly-field/readonly-field.component';
import { ReadonlyFormComponent } from './form/readonly-form/readonly-form.component';
import { LanguageSelectorComponent } from './elements/language-selector/language-selector.component';

const components = [
  InfoGridComponent,
  ReadonlyScreenComponent,
  ReadonlyFieldComponent,
  ReadonlyFormComponent,
  LanguageSelectorComponent
];

@NgModule({
  declarations: components,
  imports: [CommonModule, ModalModule, BsDropdownModule],
  exports: components,
})
export class UiModule {}
