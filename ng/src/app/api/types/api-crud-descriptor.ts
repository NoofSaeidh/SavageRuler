import { ApiDescriptor } from '../types/api-descriptor';

export type ApiCrudRequest = 'getAll' | 'get' | 'create' | 'update' | 'delete';

export class ApiCrudDescriptor extends ApiDescriptor<ApiCrudRequest> {
  static apiAppUrlPrefix = '/api/services/app/';
  constructor(typeName: string, prefix?: string) {
    let urlPrefix: string;
    // '' prefix allowed
    if (!prefix && prefix !== '') {
      urlPrefix = ApiCrudDescriptor.apiAppUrlPrefix;
    } else {
      urlPrefix = ApiDescriptor.normalizeUrl(prefix, true);
    }
    super({
      name: typeName,
      methods: {
        getAll: { url: urlPrefix + 'GetAll', httpMethod: 'GET' },
        get: { url: urlPrefix + 'Get', httpMethod: 'GET' },
        create: { url: urlPrefix + 'Create', httpMethod: 'POST' },
        update: { url: urlPrefix + 'Update', httpMethod: 'PUT' },
        delete: { url: urlPrefix + 'Delete', httpMethod: 'DELETE' },
      },
    });
  }
}
