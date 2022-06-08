import request from '@/utils/request'

// 查询生成表数据
export function listTable(query) {
  return request({
    url: '/gen/gen/list',
    method: 'get',
    params: query
  })
}

// 查询db数据库列表
export function listDbTable(query) {
  return request({
    url: '/gen/gen/db/list',
    method: 'get',
    params: query
  })
}

// 查询表详细信息
export function getGenTable(tableId) {
  return request({
    url: '/gen/gen/' + tableId,
    method: 'get'
  })
}

// 修改代码生成信息
export function updateGenTable(data) {
  return request({
    url: '/gen/gen',
    method: 'put',
    data: data
  })
}

// 导入表
export function importTable(data) {
  return request({
    url: '/gen/gen/importTable',
    method: 'post',
    params: data
  })
}

// 预览生成代码
export function previewTable(tableId) {
  return request({
    url: '/gen/gen/preview/' + tableId,
    method: 'get'
  })
}

// 删除表数据
export function delTable(tableId) {
  return request({
    url: '/gen/gen/' + tableId,
    method: 'delete'
  })
}

// 生成代码（自定义路径）
export function genCode(tableName, databaseName) {
  return request({
    url: '/gen/gen/genCode/' + tableName + '/' + databaseName,
    method: 'get'
  })
}

// 同步数据库
export function synchDb(tableName, databaseName) {
  return request({
    url: '/gen/gen/synchDb/' + tableName + '/' + databaseName,
    method: 'get'
  })
}

/**
 *列举所有的数据库 用于代码自动生成
 */
export function databaseNames() {
  return request({
    url: '/gen/databaseName/list',
    method: 'post'
  });
}
