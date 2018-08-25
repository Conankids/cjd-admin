import {getList} from '@/api/draw'
import {Message} from 'element-ui'

const draw = {
  state: {
    isLoading: false,
    list: null
  },
  mutations: {
    updateLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    updateDrawList(state, list) {
      state.list = list
    }
  },
  actions: {
    getDrawList({commit}, search) {
      commit('updateLoading', true)
      commit('updateDrawList', [])
      getList({
        params: search
      }).then(res => {
        if (res.resultCode === '0') {
          commit('updateDrawList', res.result)
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

export default draw