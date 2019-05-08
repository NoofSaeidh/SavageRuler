import { Pipe, PipeTransform } from '@angular/core';
import { Localizer } from 'src/app/localization/localizer.service';

@Pipe({
  name: 'localize',
})
export class LocalizePipe implements PipeTransform {
  constructor(private localizer: Localizer) {}

  transform(value: any, ...args: any[]): any {
    return this.localizer.localize(value, ...args);
  }
}
