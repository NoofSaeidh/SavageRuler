import Vue from 'vue';
import * as vuexTypescript from 'pipaslot-vuex-typescript';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import router from './router';
import store, { RootStore } from './store';
import { logger, ILogger } from './global/logger';

// import abpHelper from './global/abp-helper';

library.add(fas);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(BootstrapVue);
Vue.use(vuexTypescript.install, store);

Vue.config.productionTip = false;

// todo: rewrite to load partly... if it is needed
// but better not to use abp scripts
// abpHelper.loadAbpScripts();

Vue.prototype.$logger = logger;
Vue.prototype.$logUnhandled = (error: any): void => {
  logger.error(`Unhandled error: ${JSON.stringify(error, null, '\t')}`);
};

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');

declare module 'vue/types/vue' {
  interface Vue {
    $store: RootStore;
    $logger: ILogger;
    $logUnhandled: (error: any) => void;
  }
}
