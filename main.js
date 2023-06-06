import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'


Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})

app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { showMsg } from "@/utils/message"
import store from '@/store/store.js'

export function createApp() {
  const app = createSSRApp(App)
  // 加载showMsg方法到全局
	app.config.globalProperties.$showMsg = showMsg;
	// 加载store到全局
	app.use(store);
	
  return {
    app
  }
}
// #endif