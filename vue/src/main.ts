import Vue from 'vue';
import * as vuexTypescript from 'pipaslot-vuex-typescript';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App.vue';
import router from './router';
import store, { RootStore } from './store';
import { localizationHelper } from './helpers/localization-helper';

// import abpHelper from './global/abp-helper';

Vue.use(BootstrapVue);
Vue.use(vuexTypescript.install, store);

Vue.config.productionTip = false;

// todo: rewrite to load partly... if it is needed
// but better not to use abp scripts
// abpHelper.loadAbpScripts();

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');

declare module 'vue/types/vue' {
  interface Vue {
    $store: RootStore;
  }
}
