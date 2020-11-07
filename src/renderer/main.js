import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'

import Win from 'electron-vue-windows'
import pm from "./assets/js/serve";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
axios.defaults.baseURL = `http://127.0.0.1:7002`
Vue.http = Vue.prototype.$axios = axios
Vue.prototype.$pm = new pm()

// 初始化插件，要传入实例化的路由
Win.init(router, {
  freeWindowNum: 2, // 初始空闲窗口数量（选填：默认为1）
  port: 9080 // 端口号（选填：默认9080）
})
Vue.prototype.$Win = Win

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
