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
      path: '/demo/handsontable1',
      component: () => import('pages/handsontable/Demo1.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'doc'],
        name: 'Arrays of arrays as data'
      }
    }, {
      path: '/demo/handsontable2',
      component: () => import('pages/handsontable/Demo2.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'doc'],
        name: 'Arrays of objects as data'
      }
    }, {
      path: '/demo/handsontable3',
      component: () => import('pages/handsontable/Demo3.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'doc'],
        name: 'Use object prop as column'
      }
    }, {
      path: '/demo/handsontable4',
      component: () => import('pages/handsontable/Demo4.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'doc'],
        name: 'Use data schema'
      }
    }, {
      path: '/demo/handsontable5',
      component: () => import('pages/handsontable/Demo5.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'doc'],
        name: 'Function data source and schema'
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
