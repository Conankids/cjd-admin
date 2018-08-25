// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router'
import store from './store'
// import axios from 'axios'
import './base/theme/index.css'
import ElementUI from 'element-ui'
import Vuelazyload from 'vue-lazyload'
import VueClipboard from 'vue-clipboard2'

Vue.use(ElementUI)

Vue.use(VueClipboard)

Vue.use(Vuelazyload, {
  loading: require('./assets/default.jpg')
})

// Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
