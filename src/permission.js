import router from "./router";
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import {store} from './store'
import {Msg} from './tools/message';

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)){ // 判断该路由是否需要登录权限
    /** 判断用户是否已经登录 */
    const {isLogin,token} = store.getters;

    if (isLogin) { // 判断当前的user_id是否存在 ； 登录存入的user_id
      next();
    }
    else {
      next({
        path: '/login',
        // query: {redirect: to.fullPath} // 将要跳转路由的path作为参数，传递到登录页面
      })
      Msg.error('检测到您当前未登录，请先登录');
    }
  }
  else {
    next();
    // Msg.error('检测到您当前未登录，请先登录');
  }
})

router.afterEach(() => {
  NProgress.done()
});


