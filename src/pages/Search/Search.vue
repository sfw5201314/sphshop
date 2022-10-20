<template>
  <div>
    <!-- TypeNav是全局注册的组件所以不需要重新引入、 -->
    <TypeNav></TypeNav>
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div
          class="bread"
          v-show="searchParams.categoryname || searchParams.keyword"
        >
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x" v-show="searchParams.categoryname">
              {{ searchParams.categoryname }}
              <i @click="removecategoryName">×</i>
            </li>
            <li class="with-x" v-show="searchParams.keyword">
              {{ searchParams.keyword }}
              <i @click="removeKeyword">×</i>
            </li>
            <!-- 平台的售卖属性值的展示 -->
            <li
              class="with-x"
              v-for="(attrVal, index) in searchParams.props"
              :key="attrVal.attrId"
            >
              {{ attrVal.split(":")[1] }}
              <i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector 这里使用emit自定义事件接收子组件传递过来的参数-->
        <SearchSelector @putKeyword="getKeyword" @attrInfo="attrInfo" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!-- 排序的结构 -->
              <ul class="sui-nav">
                <!-- 这里动态绑定类名 如果计算属性返回的为真那么就添加active类名 -->
                <li :class="{ active: isOne }" @click="changeOrder('1')">
                  <a>
                    综合
                    <span v-show="isOne">
                      <em v-show="searchParams.order.indexOf('desc') != -1"
                        >⬆</em
                      >
                      <em v-show="searchParams.order.indexOf('asc') != -1"
                        >⬇</em
                      >
                    </span>
                  </a>
                </li>
                <li :class="{ active: isTwo }" @click="changeOrder('2')">
                  <a>
                    价格
                    <span v-show="isTwo">
                      <em v-show="searchParams.order.indexOf('desc') != -1"
                        >⬆</em
                      >
                      <em v-show="searchParams.order.indexOf('asc') != -1"
                        >⬇</em
                      >
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 销售商品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="item in goodsList" :key="item.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 在路由跳转的时候参数也要带过去 -->
                    <router-link :to="`/detail/${item.id}`">
                      <img :src="item.defaultImg" />
                    </router-link>
                    <!-- <a href="item.html" target="_blank">
                      <img :src="item.defaultImg" />
                    </a> -->
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ item.price }}</i>
                    </strong>
                  </div>
                  <div class="attr" @click="toDetail(item.id)">
                    <a
                      target="_blank"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                    >
                      {{ item.title }}
                    </a>
                  </div>
                  <div class="commit">
                    <i class="command">
                      已有
                      <span>2000</span>人评价
                    </i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <Pagination
            :pageNo="searchParams.pageNo"
            :pageSize="searchParams.pageSize"
            :total="pageList.total"
            :continues="5"
            @getPageNo="getPageNo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector.vue";
// import { mapState } from "vuex";
import { mapGetters } from "vuex";
export default {
  name: "Search",
  data() {
    return {
      //带给服务器的参数
      searchParams: {
        //一级分类id
        category1Id: "",
        //二级分类id
        category2Id: "",
        //三级分类id
        category3Id: "",
        //分类名字
        categoryname: "",
        //关键字
        keyword: "",
        //品牌
        trademark: "",
        //排序:初始的状态应该是综合降序
        order: "1:desc",
        //平台售卖属性操作带的参数
        props: [],
        //分页器当前的初始页
        pageNo: 1,
        //展示多少条数据
        pageSize: 10,
        total: 0,
      },
    };
  },
  components: { SearchSelector },
  beforeMount() {
    console.log(this.$route.query);
    console.log(this.$route.params);
    //复杂的写法 赋值
    // let { categoryname, category1Id, category2Id, category3Id } =
    //   this.$route.query;
    // console.log(categoryname);
    // this.category1Id = category1Id;
    // this.category2Id = category2Id;
    // this.category3Id = category3Id;
    // this.categoryName = categoryname;
    // console.log(this.categoryName);
    // console.log(this.category1Id);

    //使用es6中的...扩展运算符合并对象写法
    // this.searchParams = { ...this.$route.query, ...this.$route.params };
    // console.log(this.searchParams);
    //Object.assign Es6新增语法 用于合并对象
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
    // console.log(this.searchParams);
  },
  mounted() {
    //在发送请求之前带给服务器参数（searchParams发生变化有数值发给服务器）
    this.getData();
  },
  methods: {
    //把请求封装成一个函数发送请求以便后面复用
    getData() {
      //在发送请求之前带给服务器参数（searchParams发生变化有数值发给服务器）
      //向服务器发送请求获取search模块数据(根据参数的不同返回不同的数据)
      this.$store.dispatch("getSearchInfo", this.searchParams);
    },
    //删除面包屑分类的名字
    removecategoryName() {
      //把带给服务器参数置空 并再次发送请求渲染页面
      //把置空改为undefind的花这个为空的字段就可以不带给服务器减轻服务器的负担
      this.searchParams.categoryname = undefined;
      //每一次请求完毕应该把一二三级菜单的id给清空，让它接收下一次的一/二/三级id
      //不然下一次搜索的时候会带上上一次的id会导致搜索失败
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      // this.getData();

      //这里是如果路由中存在params参数就把params参数保存下来
      if (this.$route.params) {
        this.$router.push({ name: "search", params: this.$route.params });
      }
    },
    //删除面包屑params关键字
    removeKeyword() {
      //这里删除是返回上一层的菜单所以不需要把id置空
      this.searchParams.keyword = undefined;
      //这里如果路由中有query参数在删除params的关键字标签后把params参数保存下来
      if (this.$route.query) {
        this.$router.push({ name: "search", query: this.$route.query });
      }
      //点击删除后把当前的空keyword使用全局事件总线传递给header组件使input里面的关键字清空
      //全局事件总线适用于所有组件之间传递
      this.$bus.$emit("clear", this.searchParams.keyword);
    },
    //使用自定义事件接收子组件传递过来的参数进行路由跳转发送请求
    getKeyword(data) {
      console.log(data);
      //data就是子组件点击后获取到的keyword把传递过来的keyword赋值给params里面的keyword
      //使用子组件的keyword发送请求获取到品牌的信息
      this.$route.params.keyword = data;
      // this.getData();
      //因为watch了路由的变化所以这里不需要单独的发送一个请求
      //获取到品牌的信息进行路由的跳转到品牌页面 需要把query和params一起带上
      this.$router.push({
        name: "search",
        params: this.$route.params,
        query: this.$route.query,
      });
    },
    //使用自定义事件接收子组件传递过来的参数进行商品属性的请求
    attrInfo(attr, attrVal) {
      console.log(attrVal);
      console.log(attr);
      //  ["属性ID:属性值:属性名"]
      let props = `${attr.attrId}:${attrVal}:${attr.attrName}`;
      console.log(props);
      //数组去重 indexOf(props) == -1就是数组中没有props这个数组就可以向里面添加props
      if (this.searchParams.props.indexOf(props) == -1) {
        this.searchParams.props.push(props);
        this.getData();
      }
    },
    //点击删除售卖属性的tag
    removeAttr(index) {
      //点击删除售卖属性就把当前点击的索引值的元素删除并发送请求
      //在位置index，删除 1 个元素
      this.searchParams.props.splice(index, 1);
      this.getData();
    },
    changeOrder(flag) {
      //flag形参是一个标记 代表用户点击的是综合(1)还是价格(2) flag是用户点击的时候传递过来的
      console.log(flag);
      let originOrder = this.searchParams.order.split(":");
      //定义一个新的order
      let newOrder = "";
      console.log(originOrder);
      //如果初始相同一定是点击的是综合
      if (flag == originOrder[0]) {
        newOrder = `${originOrder[0]}:${
          originOrder[1] == "desc" ? "asc" : "desc"
        }`;
        console.log(newOrder);
      } else {
        //这里不相同时点击的就是价格
        //这里默认价格就是降序
        newOrder = `${flag}:${"desc"}`;
      }
      this.searchParams.order = newOrder;
      this.getData();
    },
    //使用自定义事件接收子组件传过来的页码值 进行页面的跳转
    getPageNo(data) {
      this.searchParams.pageNo = data;
      console.log(this.searchParams.pageNo);
      this.getData();
    },
    toDetail(id) {
      //点击后把获取到的商品id赋值给skuId 然后进行路由跳转的时候把这个参数带过去
      this.$route.params.skuId = id;
      this.$router.push({
        name: "detail",
        params: this.$route.params,
      });
    },
  },
  computed: {
    // ...mapState({
    //   searchList: (state) => state.search.searchList,
    // }),

    //mapGetters传递的是一个数组
    ...mapGetters(["goodsList", "pageList"]),
    // ...mapGetters(["pageList"]),
    // 这里动态绑定类名 如果searchParams.order包含1那么就添加active类名
    isOne() {
      return this.searchParams.order.indexOf("1") != -1;
    },
    isTwo() {
      return this.searchParams.order.indexOf("2") != -1;
    },
  },
  //数据监听 监听组件实例身上的属性的属性值的变化
  watch: {
    //监听路由的变化,如果发生变化再次发生请求
    $route: {
      // immediate: true,
      // deep: true,
      handler(newVal, oldVal) {
        console.log("路由发生了变化");
        // console.log(this.pageList);
        //如果不把当前的路由参数封装到getdata()函数里面的话
        //就需要重新在watch里面赋值一遍Object.assign(this.searchParams, this.$route.query, this.$route.params);
        Object.assign(this.searchParams, this.$route.query, this.$route.params);
        this.getData();
        console.log(this.searchParams);
        //每一次请求完毕应该把一二三级菜单的id给清空，让它接收下一次的一/二/三级id
        //不然下一次搜索的时候会带上上一次的id会导致搜索失败
        this.searchParams.category1Id = "";
        this.searchParams.category2Id = "";
        this.searchParams.category3Id = "";
      },
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: 1px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>