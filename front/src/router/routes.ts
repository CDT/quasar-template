import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
      path: '',
      component: () => import('pages/IndexPage.vue'),
      meta: {
        requiresAuth: true
      }
    }],
  },
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }]
  },
  // Error page
  {
    path: '/error/:code(\\d+)?',
    name: 'error',
    component: () => import('pages/Error.vue'),
    props: route => ({
      code: parseInt(route.params.code as string) || 404,
      message: route.query.message
    })
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error.vue'),
  },
];

export default routes;
