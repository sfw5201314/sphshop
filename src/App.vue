<template>
  <div>
    <Header></Header>
    <router-view></router-view>
    <!-- 使用路由来操作Footer的显示与隐藏 但是这种方式不方便不推荐使用 -->
    <!-- <Footer
      v-show="$route.path == '/home' || $route.path == '/search'"
    ></Footer> -->
    <Footer v-show="$route.meta.showFooter"></Footer>
  </div>
</template>

<script>
import Header from "./components/Header/Header.vue";
import Footer from "./components/Footer/Footer.vue";
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    Header,
    Footer,
  },
  mounted() {
    //当组件挂载完毕就通知vuex向服务器发送请求获取数据存储到仓库中
    //派发一个action获取商品分类的三级列表在app组件操作是防止多次发送请求
    this.$store.dispatch("CategoryList");
  },
};
</script>

<style>
</style>
