import request from '@/utils/request'
import {urlencoded_content_type} from "@/utils/constants";

/**
 * 用户列表
 * @param data
 * @returns {Promise<unknown>}
 */
export function userList(data) {
  return request({
    url: '/system/user/userPageList',
    method: 'post',
    data: data,
    headers: {'content-type': urlencoded_content_type}
  });
}

/**
 * 添加用户
 * @param data
 * @returns {Promise<unknown>}
 */
export function addUser(data) {
  return request({
    url: '/system/user/addUser',
    method: 'post',
    data: data
  });
}

/**
 * 修改用户
 * @param data
 * @returns {Promise<unknown>}
 */
export function updateUser(data) {
  return request({
    url: '/system/user/updateUser',
    method: 'put',
    data: data
  });
}

/**
 * 删除用户
 * @param data
 * @returns {Promise<unknown>}
 */
export function deleteUser(data) {
  return request({
    url: `/system/user/deleteUserById/${data}`,
    method: 'delete'
  });
}

/**
 *
 * 查询登录用户信息
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getUserInfo() {
  return request({
    url: '/system/user/findUserInfo',
    method: 'post'
  });
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/personalCenter/updateProfile',
    method: 'post',
    data: data
  })
}

// 修改用户密码
export function updateUserPwd(data) {
  return request({
    url: '/system/personalCenter/updatePwd',
    method: 'post',
    data: data
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  return request({
    url: '/system/user/resetPwd',
    method: 'post',
    data: {
      id: userId,
      password: password
    }
  })
}

// 更新用户头像
export function updateHeadImageUrl(url) {
  return request({
    url: '/system/user/updateHeadImageUrl',
    method: 'post',
    params: {
      url: url
    }
  })
}

