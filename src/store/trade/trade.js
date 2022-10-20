import { getTradeInfo } from "@/api/index";
const state = () => ({
  userAddressList: []
});

const mutations = {
  GETUSERADDRESS(state, data) {
    state.userAddressList = data
    // console.log(state.userAddressList);
  },
};

const actions = {
  async getUserAddress({ commit }) {
    const result = await getTradeInfo()
    console.log(result);
    if (result.code == 200) {
      commit("GETUSERADDRESS", result.data)
    }
  }
};

export default {
  state,
  mutations,
  actions,
};