import axios from 'axios'
import {router} from '../router'
import store from '../store'
import Cookies from 'js-cookie'
//创建全局axios对象
const req = axios.create({
  timeout: 15000
})

// 下载文件
const downloadUrl = url => {
  let iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = url
  iframe.onload = function () {
    document.body.removeChild(iframe)
  }
  document.body.appendChild(iframe)
}

// 添加拦截器
req.interceptors.response.use(res => {
  //未登录跳转置登录页面且清空登录信息
  if (res.data.resultCode === -2) {
    Cookies.set('PHPSESSION', '')
    Cookies.set('token', '')
    router.replace({
      name: 'login'
    })
    store.commit('updateUserInfo', {
      uid: 0,
      username: ''
    })
    return res;
  }
  // 处理excel文件
  if (res.headers && (res.headers['content-type'] === 'application/vnd.ms-excel' || res.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
    downloadUrl(res.request.responseURL)
    res.data = '';
    res.headers['content-type'] = 'text/json'
    return res;
  }
  return res;
}, error => {
  // Do something with response error
  return Promise.reject(error.response.data || error.message)
})

const request = (config) => {
  return req.request(config)
  .then(res => {
    return res.data
  })
  .catch(error => {
    console.log(error)
  })
}
export default request