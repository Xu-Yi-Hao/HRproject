import layout from '@/layout'
export default {
  path: '/employee',
  name: 'employee',
  component: layout,
  children: [{
    path: '',
    name: 'employee',
    component: () => import('@/views/employee'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  }, {
    path: '/employee/detail/:id?', // 员工详情地址
    component: () => import('@/views/employee/detail.vue'),
    hidden: true,
    meta: {
      title: '员工详情'
    }
  }]
}
