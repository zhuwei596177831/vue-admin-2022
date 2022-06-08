import request from '@/utils/request';
import {logoutUrl} from '@/utils/constants'

/**
 * 退出登录
 * @returns {Promise<unknown>}
 */
export function logout(token) {
  return request({
    url: logoutUrl,
    method: 'post',
    params: {token}
  });
}
