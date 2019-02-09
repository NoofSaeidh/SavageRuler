import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoGridComponent } from './grid/info-grid/info-grid.component';
import { ReadonlyScreenComponent } from './screens/readonly-screen/readonly-screen.component';
import { ReadonlyFieldComponent } from './elements/readonly-field/readonly-field.component';
import { ReadonlyFormComponent } from './form/readonly-form/readonly-form.component';
import { ModalFormComponent } from './screens/readonly-screen/modal-form/modal-form.component';

const components = [
  InfoGridComponent,
  ReadonlyScreenComponent,
  ReadonlyFieldComponent,
  ReadonlyFormComponent,
];

@NgModule({
  declarations: [
    ...components,
    ModalFormComponent
  ],
  imports: [CommonModule],
  exports: components,
  entryComponents: [ModalFormComponent],
})
export class UiModule {}
