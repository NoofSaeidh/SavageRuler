import localization from '@/api/localization';
import { ViewField } from '@/types/view-field';
import { LocalizationMap } from '@/types/localization';
export class LocalizationHelper {
  async localizeLabels(typeName: string, fields: ViewField[]): Promise<void> {
    // todo: current culture
    const map = await localization.getLocalizedProperties(typeName);

    for (const field of fields) {
      const label = map[field.key];
      // if convert to map:
      // const label = map.get(field.key);
      if (label) {
        field.label = label;
      }
    }
  }

  async getLocalizedLabels(typeName: string): Promise<ViewField[]> {
    return await localization.getLocalizedProperties(typeName).then(map =>
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
const instance = new LocalizationHelper();
export default instance;
