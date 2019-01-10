import { AppConsts } from '@/global/app-consts';
import { LanguageInfo, SourceInfo, LocalizationMap } from '@/types/localization';
import ajax from './ajax';

export class Localization {
    readonly serviceUrlPart = '/Localization';
    async getAllLanguages(): Promise<LanguageInfo[]> {
        return await ajax
            .requestApp<LanguageInfo[]>(this.serviceUrlPart + '/GetAllLanguages')
            .then(response => response.data.result);
    }

    async getCurrentLanguage(): Promise<LanguageInfo> {
        return await ajax
            .requestApp<LanguageInfo>(this.serviceUrlPart + '/GetCurrentLanguage')
            .then(response => response.data.result);
    }

    async getAllSources(): Promise<SourceInfo[]> {
        return await ajax
            .requestApp<SourceInfo[]>(this.serviceUrlPart + '/GetAllSources')
            .then(response => response.data.result);
    }

    async getLocalizedStrings(sourceName: string, culture?: string): Promise<LocalizationMap> {
        return await ajax
            .requestApp<LocalizationMap>(this.serviceUrlPart + '/GetLocalizedStrings', {sourceName, culture})
            .then(response => response.data.result);
    }

    async getLocalizedProperties(typeName: string, culture?: string): Promise<LocalizationMap> {
        // todo: it is an object, so need convert to map?
        return await ajax
            .requestApp<LocalizationMap>(this.serviceUrlPart + '/GetLocalizedProperties', {typeName, culture})
            .then(response => response.data.result);
    }
}

const instance = new Localization();
export default instance;
