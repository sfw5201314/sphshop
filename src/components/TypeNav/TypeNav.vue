<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <!-- 事件委托 -->
      <div @mouseleave="leaveShow" @mouseenter="enterShow">
        <h2 class="all">全部商品分类</h2>
        <!-- transition过渡动画 -->
        <transition name="sort">
          <div class="sort" v-show="showNavNum">
            <!-- 利用事件的委托和编程式路由导航实现路由的跳转与传递参数 -->
            <div class="all-sort-list2" @click="goSearch">
              <!-- 一级分类 -->
              <div
                class="item bo"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
              >
                <!-- :class="{ cur: currentIndex === index }"表示当currentIndex等于当前的index值时添加cur类 -->
                <h3
                  @mouseenter="changeIndex(index)"
                  :class="{ cur: currentIndex === index }"
                >
                  <!-- 会出现卡顿所以不使用声明式路由导航 -->
                  <!-- :data-categoryName="c1.categoryName"是自定义属性 HTML中data- 后面的自动为自定义属性 -->
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                  <!-- <router-link to="/search">{{ c1.categoryName }}</router-link> -->
                </h3>
                <div class="item-list clearfix">
                  <!-- 二级分类 -->
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <!-- 会出现卡顿所以不使用声明式路由导航 -->
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                        <!-- <router-link to="/search">{{
                        c2.categoryName
                      }}</router-link> -->
                      </dt>
                      <dd>
                        <!-- 三级分类 -->
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                          <!-- 会出现卡顿所以不使用声明式路由导航 -->
                          <!-- <router-link to="/search">{{
                          c3.categoryName
                        }}</router-link> -->
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
//引入辅助函数mapState
import { mapState } from "vuex";
import throttle from "lodash/throttle";
export default {
  name: "TypeNav",
  data() {
    return {
      //存储鼠标移上哪一个一级分类
      currentIndex: -1,
      showNavNum: true,
    };
  },
  mounted() {
    //当组件挂载完毕就通知vuex向服务器发送请求获取数据存储到仓库中
    // this.$store.dispatch("CategoryList");
    // 如果不是Home路由组件将TypeNav的三级菜单进行隐藏
    this.showNav();
  },
  computed: {
    ...mapState({
      //对象写法 右侧需要的是一个函数 当使用这个计算属性的时候右侧的函数会立即执行一次
      //会注入一个参数state 为大仓库中的数据
      categoryList: (state) =>
        // console.log(state);
        state.home.categoryList,
    }),
  },
  methods: {
    //鼠标进入改变背景颜色 修改响应式数据currentIndex的属性值
    // changeIndex(index) {
    //   this.currentIndex = index;
    //   // console.log(index);
    //   // console.log(this.currentIndex);
    // },

    //添加节流优化代码
    changeIndex: throttle(function (index) {
      this.currentIndex = index;
    }, 50),
    //一级分类鼠标移出的回调
    leaveShow() {
      //当鼠标移出时currentIndex等于-1 移出背景类
      this.currentIndex = -1;
      //当当前路由为search组件时执行鼠标移出隐藏nav
      if (this.$route.meta.showTypeNav) {
        this.showNavNum = false;
      }
    },
    //使用编程式路由导航进行三级联动的路由跳转
    goSearch(event) {
      //最好的解决方案: 编程式路由导航+事件的委托
      //利用事件的委托存在一些问题需要解决
      //1.如何知道点击的一定是a标签 2.如何获取参数如(1，2，3级分类的名字和产品的id)
      // 第一个问题把子节点当中的a标签全部加上 :data-categoryName="c1.categoryName" 自定义属性 其余的没有
      //HTML中data- 后面的自动为自定义属性
      // this.$router.push("/search");
      let element = event.target;
      // console.log(element);
      //节点有一个dataset属性可以获取节点的自定义属性和属性值
      // console.log(element.dataset);
      let { categoryname, category1id, category2id, category3id } =
        element.dataset;
      // console.log(categoryname);
      // console.log(category1id);
      //如果点击的标签上有categoryname这个自定义属性则是a标签则进行路由的跳转
      if (categoryname) {
        let location = { name: "search" };
        let query = { categoryname: categoryname };
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else {
          query.category3Id = category3id;
        }
        // 整理参数给location添加一个query参数
        //如果路由跳转的时候带有params参数也要把params参数传递过去 合并参数
        if (this.$route.params) {
          location.params = this.$route.params;
          location.query = query;
          this.$router.push(location);
        }
      }
    },
    //展示三级菜单
    showNav() {
      //当当前路由为search组件时默认隐藏nav
      if (this.$route.meta.showTypeNav) {
        // console.log(1111);
        this.showNavNum = false;
      }
    },
    //鼠标进入显示nav
    enterShow() {
      //当当前路由为search组件时执行鼠标进入显示nav
      if (this.$route.meta.showTypeNav) {
        this.showNavNum = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;
      .all-sort-list2 {
        // height: 450px;
        // overflow: hidden;
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
              cursor: pointer;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                  a {
                    cursor: pointer;
                  }
                }
              }
            }
          }

          &:hover {
            .item-list {
              display: block;
            }
          }
        }
        .cur {
          background-color: skyblue;
        }
        // .item:hover {
        //   background-color: skyblue;
        // }
      }
    }
    // 过渡动画的样式
    //过渡动画进入的开始状态(进入)
    .sort-enter {
      height: 0px;
      // opacity: 0.3;
    }
    //过渡动画的结束状态(进入)
    .sort-enter-to {
      height: 461px;
      // opacity: 1;
    }
    //定义过渡动画的时间 速度
    .sort-enter-active {
      overflow: hidden;
      transition: all 0.5s linear;
    }
  }
}
</style>