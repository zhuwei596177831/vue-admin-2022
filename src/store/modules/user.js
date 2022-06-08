import {getUserInfo} from '@/api/system/user'
import {logout} from '@/api/logout'
import {login} from '@/api/login'
import {resetRouter} from '@/router'
import {getToken, removeToken, setToken} from '@/utils/cookie'

const getDefaultState = () => {
  return {
    token: getToken(),
    userName: null,
    headImageUrl: null,
    roleCodes: [],
    menuCodes: [],
    menuPaths: [],
    userInfo: {}
  }
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_NAME: (state, userName) => {
    state.userName = userName
  },
  SET_USER_HEAD_IMAGE: (state, headImageUrl) => {
    state.headImageUrl = headImageUrl
  },
  SET_ROLE_CODES: (state, roleCodes) => {
    state.roleCodes = roleCodes
  },
  SET_MENU_CODES: (state, menuCodes) => {
    state.menuCodes = menuCodes
  },
  SET_MENU_PATHS: (state, menuPaths) => {
    state.menuPaths = menuPaths
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo;
  }
};

const actions = {
  //登陆
  login({commit}, userInfo) {
    const {username, password} = userInfo;
    return new Promise((resolve, reject) => {
      login({username: username.trim(), password: password}).then(response => {
        const {data} = response;
        commit('SET_TOKEN', data.token);
        setToken(data.token);
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  //查询用户信息
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(response => {
        const {data} = response;
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const {roleCodes, menuCodes, menuPaths, name, headImageUrl} = data;
        if (!roleCodes || roleCodes.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLE_CODES', roleCodes);
        commit('SET_MENU_CODES', menuCodes);
        commit('SET_MENU_PATHS', menuPaths);
        commit('SET_USER_NAME', name);
        commit('SET_USER_INFO', data);
        commit('SET_USER_HEAD_IMAGE', headImageUrl);
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 登出
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken(); // must remove  token  first
        resetRouter();
        commit('RESET_STATE');
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  //重置token、state、route
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken();
      resetRouter();
      commit('RESET_STATE');
      resolve();
    })
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

