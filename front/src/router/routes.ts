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
      path: '/dashboard',
      component: () => import('pages/Dashboard.vue'),
      meta: {
        requiresAuth: true,
        name: '仪表盘示例'
      }
    }, {
      path: '/query/depts',
      component: () => import('pages/query/QueryDepts.vue'),
      meta: {
        requiresAuth: true,
        name: '查科室'
      }
    }, {
      path: '/query/patients',
      component: () => import('pages/query/QueryPatients.vue'),
      meta: {
        requiresAuth: true,
        name: '查患者'
      }
    }, {
      path: '/demo/table1',
      component: () => import('pages/table/Demo1.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'doc'],
        name: '表格示例 / Demo1'
      }
    }, {
      path: '/reportsim/demo1',
      component: () => import('pages/reportsim/Demo1.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'doc'],
        name: '仿报表 / Demo1'
      }
    }, {
      path: '/reportsim/demo2',
      component: () => import('pages/reportsim/Demo2.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'doc'],
        name: '仿报表 / Demo2'
      }
    }]
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
