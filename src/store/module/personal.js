import {getIndividualList} from '@/api/draw'
import {Message} from 'element-ui'

const personal = {
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
    getPersonalList({commit}, search) {
      commit('updateLoading', true)
      commit('updatePersonalList', [])
      getIndividualList({
        params: search
      }).then(res => {
        // console.log(res);
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

export default personal
