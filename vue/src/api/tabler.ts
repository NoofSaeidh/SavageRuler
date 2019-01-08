import ajax from './ajax';
import { TableField } from '@/types/table';

export class Tabler<T> {
  public readonly hasFields: boolean;

  private $$cachedFields: TableField[] | null = null;

  constructor(public getAllUrl: string, public getPropsUrl?: string) {
    this.hasFields = !!getPropsUrl;
  }

  public async getFields(): Promise<TableField[] | null> {
    if (!this.getPropsUrl) {
      return null;
    }
    return ajax.requestApp<object>(this.getPropsUrl).then<TableField[]>(response => {
      const res = Object.entries(response.data.result).map(([name, value]) => ({
        key: name,
        label: value,
        sortable: true,
      }));
      return res;
    });
  }

  // the same as getFields but caches it after first get and then reuse
  public async getCachedFields(): Promise<TableField[] | null> {
    if (this.$$cachedFields) {
      return this.$$cachedFields;
    }
    if (!this.hasFields) {
      return null;
    }
    await this.getFields().then(response => {
      if (response) {
        this.$$cachedFields = response;
      }
    });
    return this.$$cachedFields;
  }

  public resetFieldsCache() {
    this.$$cachedFields = null;
  }

  public async getData(): Promise<T[]> {
    // todo: think like it should be handled other way
    let data!: T[];
    await ajax.requestAppList<T>(this.getAllUrl).then(respose => {
      data = respose.data.result.items;
    });
    return data;
  }
}
