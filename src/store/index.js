import Vue from 'vue'
import Vuex from 'vuex'
import draw from './module/draw'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
      uid: 0,
      username: ''
    }
  },
  mutations: {
    updateUserInfo(state, userInfo) {
      state.userInfo.uid = userInfo.uid
      state.userInfo.username = userInfo.username
    }
  },
  actions: {},
  modules: {
    draw
  }
})
