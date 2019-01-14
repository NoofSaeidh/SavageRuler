import { AppConsts } from '@/global/app-consts';
import abpUtils from '@/lib/abp-utils';

export class AbpHelper {
  loadAbpScripts() {
    this.safeLoadScript(AppConsts.getAppScriptsUrlFull);
  }

  // the same as loadScript in abp
  // but check if it already loaded don't load
  // todo: perhaps should add refresh in such case
  safeLoadScript(url: string) {
    if (!this.scriptIsLoaded(url)) {
      abpUtils.loadScript(url);
    }
  }

  scriptIsLoaded(url: string): boolean {
    const scripts = document.getElementsByTagName('script');
    for (const script of scripts) {
      if (script.src === url) {
        return true;
      }
    }
    return false;
  }
}

const instance = new AbpHelper();
export default instance;
