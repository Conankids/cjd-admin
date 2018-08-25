import request from './request'

//是否登陆
export function getUserInfo(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/index/isLogin'
    })
    return request(config)
}

//注销
export function apiLogout(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/index/logout'
    })
    return request(config)
}

//登录
export function apiLogin(data = {}) {
    const config = Object.assign(data, {
        method: 'post',
        url: '/admin/index/login'
    })
    return request(config)
}