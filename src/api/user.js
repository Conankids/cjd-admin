import request from './request'

//获取用户列表
export function getUserList(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/User/list'
    })
    return request(config)
}

//修改用户状态
export function editUserStatus(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/User/ChangeBanStatus'
    })
    return request(config)
}