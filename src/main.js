import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
//引入三级联动全局组件
import TypeNav from "@/components/TypeNav/TypeNav";
import Carsousel from '@/components/Carsousel/Carsousel'
import Pagination from '@/components/Pagination/Pagination'
//注册三级联动全局组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carsousel.name, Carsousel)
//注册分页器全局组件
Vue.component(Pagination.name, Pagination)
//引入store vuex的配置对象
import store from './store'

//引入mockServe.js mock数据
import '@/mock/mockServe'
//引入swiper的样式
import 'swiper/css/swiper.css'
new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    //配置全局事件总线 全局所有的组件都能使用 适用于任意组件间的通信
    Vue.prototype.$bus = this;
  }
}).$mount('#app')
