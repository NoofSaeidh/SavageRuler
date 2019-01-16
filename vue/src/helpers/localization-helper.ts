import { localizationService } from '@/api/localization-service';
import { ViewField, ViewObjectDescriptor, ViewFieldDescriptor } from '@/types/view-object';
import localizationStore from '@/store/modules/localization';
import { Dictionary } from 'vue-router/types/router';

export class LocalizationHelper {
  get currentCulture(): string {
    return localizationStore.state.currentCulture;
  }

  async checkOrLocalizeDescriptor<T>(descriptor: ViewObjectDescriptor<T>) {
    if(descriptor.locale && descriptor.locale === this.currentCulture) {
      return;
    }
    await this.localizeDescriptor(descriptor);
  }

  async localizeDescriptor<T>(descriptor: ViewObjectDescriptor<T>) {
    const props = await this.getCachedLocalizaedProperties(descriptor.typeName);
    const entries = Object.entries(props);
    this.localizeFieldsInt(entries, descriptor.formFields);
    this.localizeFieldsInt(entries, descriptor.tableFields);
  }

  async getLocalizedLabels(typeName: string): Promise<ViewField[]> {
    const props = await this.getCachedLocalizaedProperties(typeName);
    return Object.entries(props).map(([key, label]) => ({ key, label }));
  }

  async getCachedLocalizaedProperties(typeName: string): Promise<Dictionary<string>> {
    return await localizationStore.localizeTypeAsync(typeName, () => localizationService.getLocalizedProperties(typeName, this.currentCulture));
  }

  private localizeFieldsInt<T>(props: Array<[string, string]>, fields?: ViewFieldDescriptor<T>) {
    if (!fields) {
      return;
    }
    for (const [key, label] of props) {
      const field = fields[key as keyof T];
      if (field) {
        field.label = label;
      }
    }
  }
}
export const localizationHelper = new LocalizationHelper();
