import { LocalizePipe } from './localize.pipe';
import { Localizer } from 'src/app/localization/localizer.service';

describe('LocalizePipe', () => {
  it('create an instance', () => {
    const pipe = new LocalizePipe({} as Localizer);
    expect(pipe).toBeTruthy();
  });
});
