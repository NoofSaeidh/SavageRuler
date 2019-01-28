import { ApiDescriptor } from './api-descriptor';

export class ApiDescriptorAppService<T> extends ApiDescriptor<T> {
  constructor(typeName: string) {
    const urlPrefix = `/api/services/app/${typeName}/`;
    super({
      getAll: urlPrefix + 'GetAll',
      get: urlPrefix + 'Get',
      create: urlPrefix + 'Create',
      update: urlPrefix + 'Update',
      delete: urlPrefix + 'Delete',
    });
  }
}
