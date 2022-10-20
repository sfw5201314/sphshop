<template>
  <div class="swiper-container" ref="mySwiper">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        v-for="(item, index) in imgUrlList"
        :key="item.id"
      >
        <!-- 如果点击的图片的this.currentIndex = index就给图片动态加上边框 默认第一张图片有边框 -->
        <img
          :src="item.imgUrl"
          :class="{ active: currentIndex == index }"
          @click="changeActive(index, item.imgUrl)"
        />
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
export default {
  name: "ImageList",
  props: ["imgUrlList"],
  data() {
    return {
      //给图片动态加边框的值
      currentIndex: 0,
    };
  },
  watch: {
    imgUrlList(newValue, oldValue) {
      this.$nextTick(() => {
        //当执行这个回调的时候 保证服务器的数据已经回来了 v-for已经执行完毕 轮播图结构已经渲染完毕
        //nextTick可以保证页面中的结构一定是有的 经常和很多插件一起使用
        var mySwiper = new Swiper(this.$refs.mySwiper, {
          loop: false, // 循环模式选项

          // 如果需要分页器
          // pagination: {
          //   el: ".swiper-pagination",
          //   //点击小球可以实现分页功能
          //   clickable: true,
          // },

          // 如果需要前进后退按钮
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          //显示几个图片设置
          slidesPerView: 3,
          //每一次切换图片的个数
          slidesPerGroup: 1,
        });
      });
    },
  },
  methods: {
    //点击当前图片把this.currentIndex的值修改为index使图片加上边框
    changeActive(index, imgUrl) {
      this.currentIndex = index;
      //使用全局事件总线给兄弟组件zoom传值
      this.$bus.$emit("giveUrl", imgUrl);
    },
  },
};
</script>

<style lang="less" scoped>
.swiper-container {
  height: 56px;
  width: 412px;
  box-sizing: border-box;
  padding: 0 12px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }

      // &:hover {
      //   border: 2px solid #f60;
      //   padding: 1px;
      // }
    }
  }

  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;
    &::after {
      font-size: 12px;
    }
  }
}
</style>