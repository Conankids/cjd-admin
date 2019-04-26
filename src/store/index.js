import Vue from 'vue'
import Vuex from 'vuex'
import draw from './module/draw'
import personal from './module/personal'
import personApply from './module/person-apply'

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
    draw,
    personal,
    personApply
  }
})
