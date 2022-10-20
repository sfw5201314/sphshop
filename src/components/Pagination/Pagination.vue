<template>
  <div class="pagination">
    <!-- 上 -->
    <button :disabled="pageNo == 1" @click="backPage">上一页</button>
    <button v-if="pageNo >= 4" @click="getStartNo(1)">1</button>
    <button v-if="pageNo > 4">···</button>
    <!-- 中间部分 -->
    <template v-for="(page, index) in startNumAndEndNum.endNum">
      <button
        v-if="page >= startNumAndEndNum.startNum"
        :key="index"
        @click="getPage(page)"
        :class="{ active: pageNo == page }"
      >
        {{ page }}
      </button>
    </template>
    <!-- 下 -->
    <button v-if="startNumAndEndNum.endNum < totalPage - 1">···</button>
    <button
      v-if="startNumAndEndNum.endNum < totalPage"
      @click="endBtn(totalPage)"
    >
      {{ totalPage }}
    </button>
    <button :disabled="pageNo == totalPage" @click="nextPage">下一页</button>

    <button style="margin-left: 30px">共 {{ total }} 条</button>
  </div>
</template>

<script>
import { start } from "nprogress";
export default {
  name: "Pagination",
  props: ["pageNo", "pageSize", "total", "continues"],
  data() {
    return {
      pageNum: 1,
    };
  },
  //使用计算属性进行计算
  computed: {
    //计算总共有多少页
    totalPage() {
      //Math.ceil(this.total / this.pageSize)向上取整计算
      return Math.ceil(this.total / this.pageSize);
    },
    //计算出连续的页码的起始数字和结束数字(连续的页码数字至少是5)
    startNumAndEndNum() {
      //定义两个变量存起始的数字和结束的数字
      let startNum = 0,
        endNum = 0;
      //连续的页码数字至少是5 就是至少是5页，如果出现不够5页的现象就先判断
      //如果页码数小于连续的页码数这时就是不正常的现象
      if (this.totalPage < this.continues) {
        startNum = 1;
        endNum = this.totalPage;
      } else {
        //正常现象
        //parseInt(this.continue / 2)这里是连续页码数除以2 取整 这里不能直接写-2 因为连续页码数可能会更改
        startNum = this.pageNo - parseInt(this.continues / 2);
        endNum = this.pageNo + parseInt(this.continues / 2);
        //如果当前页的起始页算出来小于1那么起始页就为1 结束页就等于连续页码数
        if (startNum < 1) {
          startNum = 1;
          endNum = this.continues;
        }
        //如果算出来的结束页大于总页码了
        if (endNum > this.totalPage) {
          endNum = this.totalPage;
          startNum = this.totalPage - this.continues + 1;
        }
      }
      return { startNum, endNum };
    },
  },
  methods: {
    //点击中间的获取中间的当前页码的值 使用emit子向父传值
    getPage(page) {
      // console.log(page);
      this.pageNum = page;
      // console.log(this.pageNum);
      this.$emit("getPageNo", this.pageNum);
    },
    //点击获取最后一个页码的值 传值
    endBtn(pageNo) {
      // console.log(pageNo);
      this.pageNum = pageNo;
      // console.log(this.pageNum);
      this.$emit("getPageNo", this.pageNum);
    },
    //点击第一个获取第一个页码的值 传值
    getStartNo(pageStart) {
      this.pageNum = pageStart;
      this.$emit("getPageNo", this.pageNum);
    },
    //点击上一页如果当前页码值大于1就-- 如果页码在小于一就等于1 并传值
    backPage() {
      if (this.pageNum > 1) {
        this.pageNum--;
      } else {
        this.pageNum = 1;
      }
      console.log(this.pageNum);
      this.$emit("getPageNo", this.pageNum);
    },
    //点击下一页如果当前页码小于totalPage的话就++ 否则当前页码就等于totalPage 并传值
    nextPage() {
      if (this.pageNum < this.totalPage) {
        this.pageNum++;
      } else {
        this.pageNum = this.totalPage;
      }
      console.log(this.pageNum);
      this.$emit("getPageNo", this.pageNum);
    },
  },
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
.active {
  background: skyblue;
}
</style>