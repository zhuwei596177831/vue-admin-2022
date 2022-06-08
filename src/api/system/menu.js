import request from '@/utils/request'
import {urlencoded_content_type} from "@/utils/constants";

/**
 * 菜单列表
 * @param data
 * @returns {Promise<unknown>}
 */
export function menuTableList(data) {
    return request({
        url: '/system/menu/menuTableList',
        method: 'post',
        data: data,
        headers: {'content-type': urlencoded_content_type}
    });
}

/**
 * 添加菜单
 * @param data
 * @returns {Promise<unknown>}
 */
export function addMenu(data) {
    return request({
        url: '/system/menu/addMenu',
        method: 'post',
        data: data
    });
}

/**
 * 修改菜单
 * @param data
 * @returns {Promise<unknown>}
 */
export function updateMenu(data) {
    return request({
        url: '/system/menu/updateMenu',
        method: 'put',
        data: data
    });
}

/**
 * 删除菜单
 * @param data
 * @returns {Promise<unknown>}
 */
export function deleteMenu(data) {
    return request({
        url: `/system/menu/deleteMenuById/${data}`,
        method: 'delete'
    });
}

/**
 * 菜单类型
 * @returns {Promise<AxiosResponse<T>>}
 */
export function menuTypes() {
    return request({
        url: '/system/menu/menuTypes',
        method: 'post'
    });
}

export function cascaderTrees(data) {
    return request({
        url: '/system/menu/cascaderTrees',
        method: 'post',
        data: data,
        headers: {'content-type': urlencoded_content_type}
    });
}
