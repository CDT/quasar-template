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
      path: '/demo/handsontable1',
      component: () => import('pages/handsontable/Demo1.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'doc'],
        name: 'Handsontable示例 / Arrays of arrays as data'
      }
    }, {
      path: '/demo/handsontable2',
      component: () => import('pages/handsontable/Demo2.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'doc'],
        name: 'Handsontable示例 / Arrays of objects as data'
      }
    }, {
      path: '/demo/handsontable3',
      component: () => import('pages/handsontable/Demo3.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'doc'],
        name: 'Handsontable示例 / Use object prop as column'
      }
    }, {
      path: '/demo/handsontable4',
      component: () => import('pages/handsontable/Demo4.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'doc'],
        name: 'Handsontable示例 / Use data schema'
      }
    }, {
      path: '/demo/handsontable5',
      component: () => import('pages/handsontable/Demo5.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'doc'],
        name: 'Handsontable示例 / Function data source and schema'
      }
    }, {
      path: '/demo/handsontable6',
      component: () => import('pages/handsontable/Demo6.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'doc'],
        name: 'Handsontable示例 / Set Data at Cell'
      }
    }, {
      path: '/demo/handsontable7',
      component: () => import('pages/handsontable/Demo7.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'doc'],
        name: 'Handsontable示例 / hotSettings and PersistentState'
      }
    }, {
      path: '/demo/table1',
      component: () => import('pages/table/Demo1.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'doc'],
        name: '表格示例 / Demo1'
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
