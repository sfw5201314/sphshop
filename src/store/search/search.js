//search模块的小仓库
import { reqGetSearchInfo } from '@/api'
//state仓库存储数据的地方
const state = {
  searchList: {}
}
//mutations修改state中数据的唯一手段 用来修改state中的数据
const mutations = {
  GETSEARCHINFO(state, data) {
    state.searchList = data
  }
}
//actions 处理actions 可以书写自己的业务逻辑 也可以处理异步
const actions = {
  async getSearchInfo({ commit }, params) {
    const result = await reqGetSearchInfo(params)
    console.log(result);
    if (result.code == 200) {
      commit("GETSEARCHINFO", result.data)
    }
  }
}
//getters 理解为计算属性 用于简化仓库数据，让组件获取仓库数据更加方便
//可以把我们将来要在组件中使用的数据简化一下 以便使用
const getters = {
  goodsList(state) {
    return state.searchList.goodsList || []
  },
  trademarkList(state) {
    return state.searchList.trademarkList || []
  },
  attrsList(state) {
    return state.searchList.attrsList || []
  },
  pageList(state) {
    let { pageNo, pageSize, total, totalPages } = state.searchList
    return {
      pageNo,
      pageSize,
      total,
      totalPages
    }
  }
}
export default {
  state,
  mutations,
  actions,
  getters,
}