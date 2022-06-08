import request from '@/utils/request'

/**
 * 登录日志记录分页列表数据
 * */
export function logPage(query) {
  return request({
    url: '/system/loginLog/page',
    method: 'post',
    params: query
  })
}

/**
 * 登录日志记录列表数据
 * */
export function logList(query) {
  return request({
    url: '/system/loginLog/list',
    method: 'post',
    params: query
  })
}

/**
 * 根据主键id查询登录日志记录
 */
export function selectLogById(id) {
  return request({
    url: '/system/loginLog/selectById/' + id,
    method: 'post'
  })
}

/**
 * 根据id删除登录日志记录
 */
export function deleleLogById(id) {
  return request({
    url: '/system/loginLog/deleteById/' + id,
    method: 'post'
  })
}

/**
 * 根据主键id数组批量删除
 */
export function deleleLogByIds(ids) {
  return request({
    url: '/system/loginLog/deleteByIds/' + ids,
    method: 'post'
  })
}
