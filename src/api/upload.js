import request from '@/utils/request';

/**
 * @author 朱伟伟
 * @date 2022-06-06 15:39:05
 * @description 文件上传
 */
export function upload(formData) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/file/upload',
    method: 'post',
    data: formData
  })
}
