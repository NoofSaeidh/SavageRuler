import { localizationService } from '@/api/localization-service';
import { ViewField } from '@/types/view-field';
import localizationStore from '@/store/modules/localization';
import { AppConsts } from '@/global/app-consts';
import { Dictionary } from 'vue-router/types/router';
// import { LocalizationMap } from '@/types/localization';
export class LocalizationHelper {
  // todo: add cache
  async localizeLabels(typeName: string, fields: ViewField[]): Promise<void> {
    const props = await this.getCachedLocalizaedProperties(typeName);

    for (const field of fields) {
      const label = props[field.key];
      if (label) {
        field.label = label;
      } else {
        field.label = field.key;
      }
    }
  }

  async getLocalizedLabels(typeName: string): Promise<ViewField[]> {
    const props = await this.getCachedLocalizaedProperties(typeName);
    return Object.entries(props).map(([key, label]) => ({ key, label }));
  }

  async getCachedLocalizaedProperties(typeName: string): Promise<Dictionary<string>> {
    return await localizationStore.localizeTypeAsync(typeName, () => localizationService.getLocalizedProperties(typeName, localizationStore.state.currentCulture));
  }
}
export const localizationHelper = new LocalizationHelper();
