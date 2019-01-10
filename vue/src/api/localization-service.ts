import { AppConsts } from '@/global/app-consts';
import { LanguageInfo, SourceInfo, LocalizationMap } from '@/types/localization';
import { Ajax } from './ajax';

export class LocalizationService {
  readonly serviceUrlPart = '/Localization';
  readonly ajax = new Ajax(AppConsts.appUrl + this.serviceUrlPart);
  async getAllLanguages(): Promise<LanguageInfo[]> {
    return (await this.ajax.request<LanguageInfo[]>('/GetAllLanguages')).result;
  }

  async getCurrentLanguage(): Promise<LanguageInfo> {
    return (await this.ajax.request<LanguageInfo>('/GetCurrentLanguage')).result;
  }

  async getAllSources(): Promise<SourceInfo[]> {
    return (await this.ajax.request<SourceInfo[]>('/GetAllSources')).result;
  }

  async getLocalizedStrings(sourceName: string, culture?: string): Promise<LocalizationMap> {
    return (await this.ajax.request<LocalizationMap>('/GetLocalizedStrings', { sourceName, culture })).result;
  }

  async getLocalizedProperties(typeName: string, culture?: string): Promise<LocalizationMap> {
    // todo: it is an object, so need convert to map?
    return (await this.ajax.request<LocalizationMap>('/GetLocalizedProperties', { typeName, culture })).result;
  }
}

export const localizationService = new LocalizationService();
