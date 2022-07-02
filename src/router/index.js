import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                    当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面
 * alwaysShow: true               当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式---如组件页面
 *                                只有一个时，会将那个子路由当做根路由显示在侧边栏---如引导页面
 *                                若你想不管路由下面的 children 声明的个数都显示你的根路由,
 *                                你可以设置alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    设置该路由进入的权限，支持多个权限叠加（哪些角色可以看到此菜单，有一个角色匹配就行）——根据用户所属的角色控制菜单权限
    fullPath:''                  路由的全路径，用来控制菜单的显示，需要跟录入菜单的路径保持完全一致！！！       ——根据给角色分配的菜单控制菜单权限
    title: 'title'               设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'/'el-icon-x' 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
    breadcrumb: false            如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
    activeMenu: '/example/list'  当路由设置了该属性，则会高亮相对应的侧边栏。
    noCache: true                如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    affix: true                  如果设置为true，TagsView不可以被关闭 缓存(默认 false)
    type: ''                     用来给path重新赋值，用于系统监控新开窗口的地址
  }
 */

/**
 * 静态路由：
 * 不需要动态判断权限的路由，如登录页、404、等通用页面
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {title: '首页管理', icon: 'el-icon-orange', affix: true}
    }]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: {title: '个人中心', icon: 'user'}
      }
    ]
  }
];

/**
 * 动态路由：需求动态判断权限并通过 addRoutes 动态添加的页面。
 */
export const asyncRoutes = [
  {
    path: '/system',
    name: 'System',
    component: Layout,
    meta: {title: '系统管理', icon: 'el-icon-s-tools', fullPath: '/system'},
    alwaysShow: true,
    children: [
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/system/menu/index'),
        meta: {title: '菜单管理', icon: 'el-icon-menu', fullPath: '/system/menu'}
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role/index'),
        meta: {title: '角色管理', icon: 'el-icon-s-custom', fullPath: '/system/role'}
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user/index'),
        meta: {title: '用户管理', icon: 'el-icon-user-solid', fullPath: '/system/user'}
      },
      {
        path: 'dict',
        name: 'Dict',
        component: () => import('@/views/system/dict/index'),
        meta: {title: '字典管理', icon: 'el-icon-postcard', fullPath: '/system/dict'}
      },
      {
        path: 'dict-data/:dictId',
        name: 'DictData',
        hidden: true,
        component: () => import('@/views/system/dict/data'),
        meta: {title: '字典数据', icon: 'el-icon-postcard'}
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/system/log/index'),
        meta: {title: '日志管理', icon: 'el-icon-s-claim', fullPath: '/system/log'},
        alwaysShow: true,
        children: [
          {
            path: 'login',
            name: 'LoginLog',
            component: () => import('@/views/system/log/login/index'),
            meta: {title: '登录日志', icon: 'el-icon-coordinate', fullPath: '/system/log/login'}
          },
          {
            path: 'operation',
            name: 'OperationLog',
            component: () => import('@/views/system/log/operation/index'),
            meta: {title: '操作日志', icon: 'el-icon-thumb', fullPath: '/system/log/operation'}
          }
        ]
      }
    ]
  },
  {
    path: '/sysMonitor',
    name: 'SysMonitor',
    component: Layout,
    meta: {title: '系统监控', icon: 'el-icon-monitor', fullPath: '/sysMonitor'},
    alwaysShow: true,
    children: [
      {
        path: '',
        meta: {title: '定时任务', icon: 'el-icon-alarm-clock', fullPath: '/sysMonitor/job', type: 'job'}
      },
      {
        path: '',
        meta: {title: 'Nacos控制台', icon: 'el-icon-data-board', fullPath: '/sysMonitor/nacos', type: 'nacos'}
      },
      {
        path: '',
        meta: {title: '服务监控中心', icon: 'el-icon-data-line', fullPath: '/sysMonitor/monitor', type: 'monitor'}
      }
    ]
  },
  {
    path: '/tool',
    name: 'Tool',
    component: Layout,
    alwaysShow: true,
    meta: {title: '系统工具', icon: 'el-icon-suitcase', fullPath: '/tool'},
    children: [
      {
        path: 'build',
        name: 'Build',
        component: () => import('@/views/tool/build/index'),
        meta: {title: '表单构建', icon: 'el-icon-c-scale-to-original', fullPath: '/tool/build'}
      },
      {
        path: 'gen',
        name: 'Gen',
        component: () => import('@/views/tool/gen/index'),
        meta: {title: '代码生成', icon: 'el-icon-rank', fullPath: '/tool/gen'}
      },
      {
        path: 'gen-edit/:tableId',
        name: 'GenEdit',
        hidden: true,
        component: () => import('@/views/tool/gen/editTable'),
        meta: {title: '代码生成修改'}
      },
    ]
  }
  // 404 page must be placed at the end !!!
  // {path: '*', redirect: '/404', hidden: true}
];

// 防止连续点击多次路由报错
// push
let routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
};
// replace
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
};

const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher // reset router
}

export default router
