import { of } from 'rxjs';
import { LocalizationDictionary } from './localization-dictionary';
import { LocalizationService } from './localization.service';

describe('LocalizationDictionary', () => {
  const service = {
    localizeStrings: () => {
      return of<{}>({ 'test-string': 'localized-test-string' });
    },
  };
  const sut = new LocalizationDictionary(service as LocalizationService);

  it('should localize string', () => {
    expect(sut['test-string']).toBe('localized-test-string');
  });

  it('should place in square brackets not localized strings', () => {
    expect(sut['not-localized']).toBe('[not-localized]');
  });
});
