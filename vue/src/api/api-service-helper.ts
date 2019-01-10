import { ApiServiceDescriptor } from '@/types/services';
import { AppConsts } from '@/global/app-consts';

export class ApiServiceHelper {
  getDefaultDescriptor(appServiceName: string): ApiServiceDescriptor {
    const base = AppConsts.appUrl + '/' + appServiceName;
    return {
      getAllUrl: base + '/GetAll',
      getUrl: base + '/Get',
      createUrl: base + '/Create',
      updateUrl: base + '/Update',
      deleteUrl: base + '/Delete',
    };
  }
}

export const apiServiceHelper = new ApiServiceHelper();
