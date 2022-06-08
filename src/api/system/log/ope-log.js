import request from '@/utils/request'

/**
 * 操作日志记录分页列表数据
 * */
export function opeLogPage(query) {
  return request({
    url: '/system/opeLog/page',
    method: 'post',
    params: query
  })
}

/**
 * 操作日志记录列表数据
 * */
export function opeLogList(query) {
  return request({
    url: '/system/opeLog/list',
    method: 'post',
    params: query
  })
}

/**
 * 根据主键id查询操作日志记录
 */
export function selectOpeLogById(id) {
  return request({
    url: '/system/opeLog/selectById/' + id,
    method: 'post'
  })
}

/**
 * 根据id删除操作日志记录
 */
export function deleleOpeLogById(id) {
  return request({
    url: '/system/opeLog/deleteById/' + id,
    method: 'post'
  })
}

/**
 * 根据主键id数组批量删除
 */
export function deleleOpeLogByIds(ids) {
  return request({
    url: '/system/opeLog/deleteByIds/' + ids,
    method: 'post'
  })
}
