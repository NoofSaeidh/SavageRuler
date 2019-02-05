import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoGridComponent } from './grid/info-grid/info-grid.component';
import { ReadonlyScreenComponent } from './screens/readonly-screen/readonly-screen.component';
import { ReadonlyFieldComponent } from './elements/readonly-field/readonly-field.component';
import { ReadonlyFormComponent } from './form/readonly-form/readonly-form.component';
import { ReadonlyScreenSingleComponent } from './screens/readonly-screen-single/readonly-screen-single.component';

const components = [
  InfoGridComponent,
  ReadonlyScreenComponent,
  ReadonlyFieldComponent,
  ReadonlyFormComponent,
  ReadonlyScreenSingleComponent
];

@NgModule({
  declarations: components,
  imports: [CommonModule],
  exports: components,
})
export class UiModule {}
