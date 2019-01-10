import { localizationService } from '@/api/localization-service';
import { ViewField } from '@/types/view';
// import { LocalizationMap } from '@/types/localization';
export class LocalizationHelper {
  // todo: add cache
  async localizeLabels(typeName: string, fields: ViewField[]): Promise<void> {
    // todo: current culture
    const map = await localizationService.getLocalizedProperties(typeName);

    for (const field of fields) {
      const label = map[field.key];
      // if convert to map:
      // const label = map.get(field.key);
      if (label) {
        field.label = label;
      }
      else {
        field.label = field.key;
      }
    }
  }

  async getLocalizedLabels(typeName: string): Promise<ViewField[]> {
    return await localizationService
      .getLocalizedProperties(typeName)
      .then(map =>
        Object
          // todo: if it became real map -> fix this
          .entries(map as object)
          .map(([name, value]) => ({
            key: name,
            label: value,
          })),
      );
  }
}
export const localizationHelper = new LocalizationHelper();
