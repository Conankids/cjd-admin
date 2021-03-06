//vuex  首页申请页面的状态
import {individualListForHome} from '@/api/draw'
import {Message} from 'element-ui'

const person_apply = {
  state: {
    isLoading: false,
    list: null
  },
  mutations: {
    updateLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    updatePersonalList(state, list) {
      state.list = list
    }
  },
  actions: {
    personListForHome({commit}, search) {
      commit('updateLoading', true)
      commit('updatePersonalList', [])
      individualListForHome({
        params: search
      }).then(res => {
        if (res.resultCode === '0') {
          commit('updatePersonalList', res.result)
          commit('updateLoading', false)
        } else {
          Message({
            type: 'error',
            message: res.errorMsg
          })
        }
      })
    }
  }
}

export default person_apply
