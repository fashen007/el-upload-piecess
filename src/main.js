// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
/* eslint-disable no-new */
Vue.use(elementUI)
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
