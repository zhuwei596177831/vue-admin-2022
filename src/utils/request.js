import axios from 'axios'
import {resetRouter} from '@/router'
import {END, START} from './loading'
import {getToken, removeToken} from '@/utils/cookie'
import qs from 'qs';
import {json_content_type, unauthorized_code, urlencoded_content_type} from "@/utils/constants";
import router from "@/router";
import {err} from "@/utils/message";
import store from "@/store";
import {Loading, Message} from 'element-ui'
import {saveAs} from 'file-saver'
import errorCode from '@/utils/errorCode'

//自定义axios实例
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)如果请求话费了超过 `timeout` 的时间，请求将被中断
  // timeout: 5000,
  timeout: 0
});

//默认使用application/json
instance.defaults.headers['Content-Type'] = json_content_type;

//请求拦截
instance.interceptors.request.use(
  config => {
    START();
    //添加自定义的Token
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    const {url, method, headers, data} = config;
    if (headers['content-type'] === urlencoded_content_type && (method === 'post' || method === 'put')) {
      config.data = qs.stringify(data);
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
//响应拦截
instance.interceptors.response.use(
  response => {
    END();
    const {data: {code, msg, success}} = response;
    if (!success) {
      //session失效
      if (code === unauthorized_code) {
        removeToken();
        resetRouter();
        store.commit('user/RESET_STATE');
        router.replace('/login');
      }
      err(msg);
      return Promise.reject(msg);
    }
    return response.data;
  },
  error => {
    END();
    err(error);
    // router.replace('/login');
    return Promise.reject(error);
  });

let downloadLoadingInstance;

// 通用下载方法
export function download(url, params, filename) {
  downloadLoadingInstance = Loading.service({text: "正在下载数据，请稍候", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)",})
  return instance.post(url, params, {
    transformRequest: [(params) => {
      return tansParams(params)
    }],
    headers: {'Content-Type': urlencoded_content_type},
    responseType: 'blob'
  }).then(async (data) => {
    const isLogin = await blobValidate(data);
    if (isLogin) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      Message.error(errMsg);
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    Message.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close();
  })
}

export default instance;
