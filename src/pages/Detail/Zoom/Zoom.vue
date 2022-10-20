<template>
  <div class="spec-preview">
    <!-- 这里动态绑定图片的路径使用三元表达式
    imgUrl ? imgUrl : imgUrlList[0].imgUrl
    这里的意思为如果兄弟组件传过来的值imgUrl为空就用默认的imgUrlList里面的路径 反之 -->
    <img :src="imgUrl ? imgUrl : imgUrlList[0].imgUrl" />
    <div class="event" @mousemove="handler"></div>
    <div class="big">
      <img :src="imgUrl ? imgUrl : imgUrlList[0].imgUrl" ref="bigImg" />
    </div>
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
export default {
  name: "Zoom",
  data() {
    return {
      imgUrl: "",
    };
  },
  props: ["imgUrlList"],
  mounted() {
    this.$bus.$on("giveUrl", (data) => {
      this.imgUrl = data;
    });
  },
  methods: {
    handler(event) {
      // console.log(111);
      let mask = this.$refs.mask;
      let bigImg = this.$refs.bigImg;
      //mask是图片展示盒子里面的遮罩层
      //使用当前元素的offsetX减去mask盒子宽度的一般可以得到大盒子距离mask盒子的left值
      //mask.offsetWidth鼠标到盒子的距离
      let left = event.offsetX - mask.offsetWidth / 2;
      let top = event.offsetY - mask.offsetHeight / 2;
      // console.log(left, top);
      //约束范围
      if (left <= 0) left = 0;
      if (left >= mask.offsetWidth) left = mask.offsetWidth;
      if (top <= 0) top = 0;
      if (top >= mask.offsetHeight) top = mask.offsetHeight;
      //修改元素的left和top属性值
      mask.style.left = left + "px";
      mask.style.top = top + "px";
      //修改放大镜里面图片的left和top值
      //因为大图和展示图是相反的鼠标左移大图里面图片是右移所以要负值
      bigImg.style.left = -2 * left + "px";
      bigImg.style.top = -2 * top + "px";
    },
  },
};
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>