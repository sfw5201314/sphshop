import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//state仓库存储数据的地方
// const state = {
//   count: 1,
// }
// //mutations修改state中数据的唯一手段 用来修改state中的数据
// const mutations = {}
// //actions 处理actions 可以书写自己的业务逻辑 也可以处理异步
// const actions = {}
// //getters 理解为计算属性 用于简化仓库数据，让组件获取仓库数据更加方便
// const getters = {}

//引入小仓库 使用vuex的模块化开发
import home from './home/home'
import search from './search/search'
import detail from './detail/detail'
import shopCart from './shopCart/shopCart'
import trade from './trade/trade'
export default new Vuex.Store({
  //实现vuex仓库模块式开发存储数据
  modules: {
    home,
    search,
    detail,
    shopCart,
    trade
  }
})
