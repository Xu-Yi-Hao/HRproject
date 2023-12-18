import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { asyncRoutes } from '@/router'

/**
 * 前置守卫
 */
// 白名单
const whiteList = ['/login', '/404']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (store.getters.token) {
    // 存在token
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    }
    else {
      // 判断是否获取过资料
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        const filterRoutes = asyncRoutes.filter(item => {
          return roles.menus.includes(item.name)
        })
        console.log(filterRoutes);
        store.commit('user/setRoutes', filterRoutes)
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

/**
 * 后置守卫
 */
router.afterEach(() => {
  NProgress.done()
})