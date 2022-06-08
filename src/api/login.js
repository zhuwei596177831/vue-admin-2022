import {urlencoded_content_type, file_content_type, json_content_type, loginUrl} from '@/utils/constants'
import request from '@/utils/request';

export function login(data) {
  return request({
    url: loginUrl,
    method: 'post',
    data: data,
    headers: {'content-type': urlencoded_content_type}
  });
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/auth/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

//post json
// this.axios.post('/getOrganList', this.loginForm)

//post application/x-www-form-urlencoded
// this.axios.post('/getOrganList', qs.stringify(this.loginForm),
//     {
//         headers: {'content-type': 'application/x-www-form-urlencoded'},
//     }
// )

//post multipart/form-data
// const configs = {
//     headers: {'content-type': 'multipart/form-data'}
// };
// let forms = new FormData();
// forms.append('username',this.loginForm.username);
// forms.append('password',this.loginForm.password);
// forms.append('picFile', null);
// this.axios.post('/getOrganList', forms, configs)

//get param
// this.axios.get('/getOrganList', {
//     params: this.loginForm
// })
