import Vue from 'vue'
import App from './App.vue'

import t from "../lib/index";
Vue.use(t)

new Vue({
  el: '#app',
  render: h => h(App)
})
