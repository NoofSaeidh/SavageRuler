// url must not contain base part defined as AppConsts.baseUrl: http://localhost:21021
// only everything after, example:
// getAllUrl: '/api/services/app/appName/GetAll'
export interface ApiServiceDescriptor {
  getAllUrl?: string;
  getUrl?: string;
  createUrl?: string;
  updateUrl?: string;
  deleteUrl?: string;
}
