import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/cookie' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({showSpinner: false}); // NProgress Configuration

const whiteList = ['/login']; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({path: '/'});
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.userName;
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          const {roleCodes, menuPaths} = await store.dispatch('user/getInfo');
          const accessRoutes = await store.dispatch('permission/generateRoutes', {
            roleCodes: roleCodes,
            menuPaths: menuPaths
          });
          //404页面要放在最后
          accessRoutes.push({path: '*', redirect: '/404', hidden: true});
          router.addRoutes(accessRoutes);
          next({...to, replace: true})
        } catch (error) {
          await store.dispatch('user/resetToken');
          next('/login');
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next('/login');
      // next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
});
