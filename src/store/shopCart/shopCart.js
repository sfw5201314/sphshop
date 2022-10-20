import { reqGetShopCartList } from '@/api/index'
const state = {
  cartInfoList: []
}

const mutations = {
  GETCARTLIST(state, data) {
    state.cartInfoList = data
  }
};

const actions = {
  async getCartList({ commit }) {
    const result = await reqGetShopCartList();
    // console.log(result);
    if (result.code == 200) {
      commit("GETCARTLIST", result.data)
    }
  }
};
const getters = {
  cartList(state) {
    return state.cartInfoList[0] || {}
  }
}
export default {
  state,
  mutations,
  actions,
  getters
};