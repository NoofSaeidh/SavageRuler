import Vue from 'vue';
import Router from 'vue-router';
import { queryHelper } from './queryHelper';

Vue.use(Router);

function loadView(view: string) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`);
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: loadView('Home'),
    },
    {
      path: '/about',
      name: 'about',
      component: loadView('About'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: loadView('AuthView'),
    },
    {
      path: '/power',
      name: 'power',
      component: loadView('rules/PowerView'),
      props: queryHelper.mapRoute({ property: 'id', type: 'int' }, { property: 'inModal', type: 'boolean' }),

      // children: [
      //   {
      //     path: ':id',
      //     name: 'power',
      //     redirect: route => ({ name: 'powers', params: { id: '5' } }),
      //   },
      // ],
    },
    {
      path: '/404',
      name: '404',
      component: loadView('PageNotFound'),
    },
    {
      path: '*',
      redirect: '/404',
    },
  ],
});
