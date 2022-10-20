<template>
  <!--banner轮播-->
  <div class="swiper-container" ref="mySwiper">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        v-for="(carousel, index) in list"
        :key="carousel.id"
      >
        <img :src="carousel.imgUrl" />
        <!-- //模板字符串写法 -->
        <!-- <img :src="`${carousel.imgUrl}`"> -->
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
//引入swiper
import Swiper from "swiper";
export default {
  name: "Carsousel",
  data() {
    return {};
  },
  props: ["list"],
  // watch: {
  //   //监听bannerList的变化 因为这条数据发生了变化 由空数组变为有原素的过程
  //   //如果handler里面的回调执行则代表bannerList数据已经发生了变化由空变成有元素的数组
  //   //当这个函数执行只能表示bannerList发生了变化 不能保证v-for已经把数据渲染到页面上
  //   //v-for执行完毕才有结构

  //   //nextTick:在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
  //   bannerList: {
  //     handler(newValue, oldValue) {
  //       this.$nextTick(() => {
  //         //当执行这个回调的时候 保证服务器的数据已经回来了 v-for已经执行完毕 轮播图结构已经渲染完毕
  //         //nextTick可以保证页面中的结构一定是有的 经常和很多插件一起使用
  //         var mySwiper = new Swiper(this.$refs.mySwiper, {
  //           loop: true, // 循环模式选项

  //           // 如果需要分页器
  //           pagination: {
  //             el: ".swiper-pagination",
  //             //点击小球可以实现分页功能
  //             clickable: true,
  //           },

  //           // 如果需要前进后退按钮
  //           navigation: {
  //             nextEl: ".swiper-button-next",
  //             prevEl: ".swiper-button-prev",
  //           },
  //         });
  //       });
  //     },
  //   },
  // },
  watch: {
    //监听bannerList的变化 因为这条数据发生了变化 由空数组变为有原素的过程
    //如果handler里面的回调执行则代表bannerList数据已经发生了变化由空变成有元素的数组
    //当这个函数执行只能表示bannerList发生了变化 不能保证v-for已经把数据渲染到页面上
    //v-for执行完毕才有结构
    list: {
      //immediate代表立即监听不需要数据发生变化再监听
      //因为list是父组件传过来的固定值不会发生变化
      immediate: true,
      handler() {
        //只能监听到数据已经有了 但是不能确定v-for的数据已经渲染完毕
        //所以就还需要使用nextTick
        //nextTick:在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
        // console.log(111);
        this.$nextTick(() => {
          //当执行这个回调的时候 保证服务器的数据已经回来了 v-for已经执行完毕 轮播图结构已经渲染完毕
          //nextTick可以保证页面中的结构一定是有的 经常和很多插件一起使用
          var mySwiper = new Swiper(this.$refs.mySwiper, {
            loop: true, // 循环模式选项

            // 如果需要分页器
            pagination: {
              el: ".swiper-pagination",
              //点击小球可以实现分页功能
              clickable: true,
            },

            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped>
</style>