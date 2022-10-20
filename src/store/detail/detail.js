//detail模块的小仓库
import { reqGetDetailInfo } from '@/api'
import { reqAddOrupDateShopCart } from '@/api'
//封装的游客身份的模块uuid 生成一个随机的字符串
import { getUUID } from '@/utils/uuid_token'
const state = {
  detailList: {},
  //游客的临时身份
  uuid_token: getUUID()
}
const mutations = {
  GETDETAILLIST(state, data) {
    state.detailList = data
  }
}
const actions = {
  async getDetailList({ commit }, skuId) {
    let result = await reqGetDetailInfo(skuId)
    console.log(result);
    if (result.code == 200) {
      commit("GETDETAILLIST", result.data)
    }
  },
  //将产品添加到购物车中
  async addOrupDateShopCart({ commit }, { skuId, skuNum }) {
    console.log(skuId, skuNum);
    let result = await reqAddOrupDateShopCart(skuId, skuNum)
    console.log(result);
    //代表服务器发送请求加入购物车成功
    if (result.code == 200) {
      //成功就返回一个非空字符串 
      return "ok"
    } else {
      //加入购物车失败就返回一个promise失败的回调
      return Promise.reject(new Error("erroe"))
    }
  }
}
const getters = {
  //路径导航信息的简化
  categoryView(state) {
    return state.detailList.categoryView || {}
  },
  //产品信息的简化
  skuInfo(state) {
    return state.detailList.skuInfo || {}
  },
  //售卖属性信息的简化
  spuSaleAttrList(state) {
    return state.detailList.spuSaleAttrList || []
  },
}
export default {
  state,
  mutations,
  actions,
  getters
}
