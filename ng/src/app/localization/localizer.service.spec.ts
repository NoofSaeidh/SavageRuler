import { of } from 'rxjs';
import { Localizer } from './localizer.service';
import { LocalizationService } from './localization.service';

describe('Localizer', () => {
  const service = {
    localizeStrings: () => {
      return of<{}>({
         'test-string': 'localized-test-string',
         'complex-string': '0 - {0}, 1 - {1}, 0 - {0}'
      });
    },
  };
  const sut = new Localizer(service as LocalizationService);

  it('should localize string', () => {
    expect(sut.localize('test-string')).toBe('localized-test-string');
  });

  it('should place in square brackets not localized strings', () => {
    expect(sut.localize('not-localized')).toBe('[not-localized]');
  });

  it('should replace placeholders with arguments', () => {
    expect(sut.localize('complex-string', 'foo', 'bar')).toBe('0 - foo, 1 - bar, 0 - foo');
  });
});
