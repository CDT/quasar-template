import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
      path: '',
      component: () => import('pages/IndexPage.vue'),
      meta: {
        requiresAuth: true,
        name: '主页'
      }
    }, {
      path: '/query/depts',
      component: () => import('pages/QueryDepts.vue'),
      meta: {
        requiresAuth: true,
        name: '科室查询'
      }
    }, {
      path: '/query/emps',
      component: () => import('pages/QueryEmps.vue'),
      meta: {
        requiresAuth: true,
        requiredRoles: ['admin', 'doc'],
        name: '员工检索'
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
]

export default routes
