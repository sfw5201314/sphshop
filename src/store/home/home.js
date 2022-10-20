//引入二次封装好的axios接口API
import { reqCategoryList, reqMockBanner, reqMockFloor } from '@/api'
//home模块的小仓库
//state仓库存储数据的地方
const state = {
  //state的初始值 服务器返回的数据保存到CategoryList里面
  categoryList: [],
  bannerList: [],
  floorList: []
}
//mutations修改state中数据的唯一手段 用来修改state中的数据
const mutations = {
  CATEGORYLIST(state, categoryList) {
    state.categoryList = categoryList.splice(0, categoryList.length - 4)
  },
  GETBANNERLIST(state, bannerList) {
    state.bannerList = bannerList
  },
  GETFLOORLIST(state, floorList) {
    state.floorList = floorList
  }
}
//actions 处理actions 可以书写自己的业务逻辑 也可以处理异步
const actions = {
  //通过API的接口函数调用 向服务器发送请求 获取服务器的数据
  async CategoryList({ commit }) {
    let result = await reqCategoryList()
    // console.log(result);
    if (result.code === 200) {
      commit("CATEGORYLIST", result.data)
    }
  },
  //调用接口获取首页轮播图数据
  async getBannerList({ commit }) {
    let result = await reqMockBanner()
    // console.log(result);
    if (result.code === 200) {
      //向mutations提交 action里面不能直接修改数据
      commit('GETBANNERLIST', result.data)
    }
  },
  async getFloorList({ commit }) {
    let result = await reqMockFloor()
    // console.log(result.data);
    if (result.code === 200) {
      commit("GETFLOORLIST", result.data)
    }
  }
}
//getters 理解为计算属性 用于简化仓库数据，让组件获取仓库数据更加方便
const getters = {}
export default {
  state,
  mutations,
  actions,
  getters,
}