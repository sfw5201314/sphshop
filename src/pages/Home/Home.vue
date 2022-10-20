<template>
  <div>
    <!-- 三级联动全局组件 不需要再次注册 -->
    <TypeNav />
    <!-- //其他组件 -->
    <ListContainer />
    <Recommend />
    <Rank />
    <Like />
    <!-- //这里是利用props进行父子间组件的传值 -->
    <Floor v-for="item in floorList" :key="item.id" :list="item" />
    <Brand />
  </div>
</template>

<script>
import ListContainer from "@/pages/Home/ListContainer/ListContainer.vue";
import Recommend from "@/pages/Home/recommend/Recommend.vue";
import Rank from "@/pages/Home/rank/Rank.vue";
import Like from "@/pages/Home/like/Like.vue";
import Floor from "@/pages/Home/floor/Floor.vue";
import Brand from "@/pages/Home/brand/Brand.vue";
import { mapState } from "vuex";
import { getUserInfo } from "@/api/index";
export default {
  name: "Home",
  data() {
    return {};
  },
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand,
  },
  async mounted() {
    //派发action获取floor的数据
    this.$store.dispatch("getFloorList");
    //登陆成功后获得token给服务器发送请求获取用户信息
    const result = await getUserInfo();
    console.log(result);
    //拿到用户信息把用户信息使用全局事件总线发送给header组件渲染
    if (result.code == 200) {
      this.$bus.$emit("getUserInfo", result.data);
    }
  },
  computed: {
    ...mapState({
      floorList: (state) => state.home.floorList,
    }),
  },
};
</script>

<style>
</style>