import Vue from 'vue'
import ElementUI from 'element-ui'
import VueCookies from 'vue-cookies'
import '../public/css/iconfont.css'
import './assets/css/style.css'
import App from './App.vue'
import router from './router'
import echarts from 'echarts'
import axios from 'axios'


Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.prototype.$http = axios

Vue.use(ElementUI);
Vue.use(VueCookies);


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
