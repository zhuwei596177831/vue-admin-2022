import {asyncRoutes, constantRoutes} from '@/router'
import store from '@/store'

/**
 * 根据用户角色编码集合 过滤动态路由
 * */
function hasPermissionFromRole(roleCodes, route) {
  if (route.meta && route.meta.roles) {
    return roleCodes.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 根据用户菜单路径集合 过滤动态路由
 * */
function hasPermissionFromMenuPath(menuPaths, route) {
  if (route.meta.fullPath) {
    // return menuPaths.some(path => route.meta.fullPath === path);
    // return menuPaths.some(path => route.meta.fullPath === path)
    return menuPaths.includes(route.meta.fullPath);
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param asyncRoutes asyncRoutes
 * @param roleCodes 角色编码array
 */
export function filterAsyncRoutesFromRole(asyncRoutes, roleCodes) {
  const res = [];

  asyncRoutes.forEach(asyncRoute => {
    const tmp = {...asyncRoute};
    if (hasPermissionFromRole(roleCodes, tmp)) {
      resetPathIfNecessary(tmp);
      if (tmp.children) {
        tmp.children = filterAsyncRoutesFromRole(tmp.children, roleCodes)
      }
      res.push(tmp)
    }
  });
  return res
}

/**
 * Filter asynchronous routing tables by recursion
 * @param asyncRoutes asyncRoutes
 * @param menuPaths 菜单路径array
 */
export function filterAsyncRoutesFromMenuPath(asyncRoutes, menuPaths) {
  const res = [];

  asyncRoutes.forEach(asyncRoute => {
    const tmp = {...asyncRoute};
    if (hasPermissionFromMenuPath(menuPaths, tmp)) {
      resetPathIfNecessary(tmp);
      if (tmp.children) {
        tmp.children = filterAsyncRoutesFromMenuPath(tmp.children, menuPaths)
      }
      res.push(tmp)
    }
  });
  return res;
}

/**
 * 给path重新赋值
 * 1、用于系统监控新开窗口的地址
 * @param route
 */
function resetPathIfNecessary(route) {
  if (route.meta && route.meta.type) {
    if (route.meta.type === 'job') {
      route.path = store.getters.userInfo.jobAddress;
    } else if (route.meta.type === 'nacos') {
      route.path = store.getters.userInfo.nacosAddress;
    } else if (route.meta.type === 'monitor') {
      route.path = store.getters.userInfo.monitorAddress;
    }
  }
}

const state = {
  routes: [],
  addRoutes: [],
  defaultRoutes: [],
  topbarRouters: [],
  sidebarRouters: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  },
  SET_DEFAULT_ROUTES: (state, routes) => {
    state.defaultRoutes = routes;
  },
  SET_TOPBAR_ROUTES: (state, routes) => {
    state.topbarRouters = routes;
  },
  SET_SIDEBAR_ROUTERS: (state, routes) => {
    state.sidebarRouters = routes;
  }
};

const actions = {
  generateRoutes({commit}, {roleCodes, menuPaths}) {
    return new Promise(resolve => {
      // if (roleCodes.includes(admin_role_name)) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roleCodes)
      // }
      // let accessedRoutes = filterAsyncRoutesFromRole(asyncRoutes, roleCodes);
      //目前是根据给角色分配的 菜单权限 控制 侧边栏路由菜单 的显示和隐藏
      let accessedRoutes = filterAsyncRoutesFromMenuPath(asyncRoutes, menuPaths);
      commit('SET_ROUTES', accessedRoutes);
      commit('SET_SIDEBAR_ROUTERS', accessedRoutes);
      commit('SET_DEFAULT_ROUTES', accessedRoutes);
      commit('SET_TOPBAR_ROUTES', accessedRoutes);
      resolve(accessedRoutes);
    })
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
