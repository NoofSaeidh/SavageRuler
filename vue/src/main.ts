import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
// import abpHelper from './global/abp-helper';

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

// todo: rewrite to load partly... if it is needed
// abpHelper.loadAbpScripts();

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
