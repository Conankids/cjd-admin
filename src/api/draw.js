import request from './request'

//上传图片
export function upLoadPic(data = {}) {
  const config = Object.assign(data, {
    method: 'post',
    url: '/admin/Lotterylist/UploadImg',
    headers: {'Content-Type': 'multipart/form-data'}
  })
  return request(config)
}

//获取赞助商小程序列表
export function getWxcodeList(data = {}) {
  const config = Object.assign(data, {
    method: 'post',
    url: '/admin/Lotterysponsorwxcode/wxcodeList'
  })
  return request(config)
}

//提交抽奖活动
export function subEvent(data = {}) {
  const config = Object.assign(data, {
    method: 'post'
  })
  return request(config)
}

//获取抽奖活动
export function getInfo(data = {}) {
  const config = Object.assign(data, {
    method: 'get',
    url: '/admin/Lotterylist/info'
  })
  return request(config)
}

//获取抽奖活动列表
export function getList(data = {}) {
  const config = Object.assign(data, {
    method: 'get',
    url: '/admin/Lotterylist/list'
  })
  return request(config)
}

//活动上线
export function online(data = {}) {
  const config = Object.assign(data, {
    method: 'get',
    url: '/admin/Lotterylist/Online'
  })
  return request(config)
}

//活动下线
export function offline(data = {}) {
  const config = Object.assign(data, {
    method: 'get',
    url: '/admin/Lotterylist/Offline'
  })
  return request(config)
}

//活动删除
export function del(data = {}) {
  const config = Object.assign(data, {
    method: 'get',
    url: '/admin/Lotterylist/Delete'
  })
  return request(config)
}

//获取活动统计数据
export function getShowData(data = {}) {
  const config = Object.assign(data, {
    method: 'get',
    url: '/admin/Lotterylist/GetShowData'
  })
  return request(config)
}

export function getItemData(data = {}) {
  const config = Object.assign(data, {
    method: 'get',
    url: '/admin/Lotterylist/info'
  })
  return request(config)
}

//获取数据概况
export function getData(data = {}) {
  const config = Object.assign(data, {
    method: 'get',
    url: '/admin/Lotterylist/GetIndividualTotalShowData'
  })
  return request(config)
}
//获取中奖名单
export function getLotteryList(data = {}) {
  const config = Object.assign(data, {
    method: 'get',
    url: '/admin/LotteryOrderList/GetListByLid'
  })
  return request(config)
}

//提交快递信息
export function subSend(data = {}) {
  const config = Object.assign(data, {
    method: 'get',
    url: '/admin/LotteryOrderList/SetExpressInformation'
  })
  return request(config)
}

//发送提醒push
export function sendPushMsg(data = {}) {
  const config = Object.assign(data, {
    method: 'get',
    url: '/admin/LotteryOrderList/PushSetExpressInformationMsg'
  })
  return request(config)
}

//获取个人抽奖活动列表数据
export function getIndividualList(data = {}) {
  const config = Object.assign(data, {
    method: 'get',
    url: '/admin/Lotterylist/IndividualList'
  })
  return request(config)
}




