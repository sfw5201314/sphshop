<template>
  <!-- 头部 -->
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <p v-if="!userInfo">
            <span>请</span>
            <!-- 使用router-link进行路由跳转 -->
            <router-link to="/login">登录</router-link>
            <!-- <a href="###">登录</a> -->
            <router-link to="/register" class="register">免费注册</router-link>
          </p>
          <p v-if="userInfo">
            <span>{{ userInfo.loginName }}</span>
            <a href="javascript:" style="margin-left: 15px" @click="loginOut"
              >退出登陆</a
            >
          </p>
        </div>
        <div class="typeList">
          <a href="###">我的订单</a>
          <router-link to="/shopCart">我的购物车</router-link>
          <!-- <a href="###">我的购物车</a> -->
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <!-- 使用router-link进行路由跳转 -->
        <router-link class="logo" title="尚品汇" to="/home">
          <img src="./images/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <!-- @keyup.enter="goSearch"事件需要在输入框加最后的一个输入框 -->
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keyword"
            @keyup.enter="goSearch"
          />
          <button
            class="sui-btn btn-xlarge btn-danger"
            type="button"
            @click="goSearch"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
import { reqLoginOut } from "@/api/index";
export default {
  name: "Header",
  data() {
    return {
      keyword: "",
      userInfo: "",
    };
  },
  methods: {
    //跳转到search组件
    goSearch() {
      console.log(111);
      //点击搜索按钮使用编程式路由跳转进行跳转
      //解决连续点击路由跳转会报错使用一个成功得回调和一个失败的回调解决
      //这里也需要判断是否带有query参数 如果有那么也要把qurery参数带过去
      if (this.$route.query) {
        let location = {
          name: "search",
          params: { keyword: this.keyword || undefined },
        };
        location.query = this.$route.query;
        this.$router.push(location);
        // this.keyword = "";
      }
      // this.$router.push(
      //   {
      //     name: "search",
      //     params: {
      //       keywords: this.keywords || undefined,
      //     },
      //   },
      //   () => {},
      //   () => {}
      // );
    },
    //退出登陆
    async loginOut() {
      if (confirm("确定退出登陆吗?")) {
        const result = await reqLoginOut();
        console.log(result);
        if (result.code == 200) {
          //退出登陆后把用户信息情况并跳转到登陆界面
          window.sessionStorage.removeItem("USERINFO");
          window.localStorage.removeItem("USER_TOKEN");
          this.userInfo = "";
          this.$router.push("/login");
        }
      }
    },
  },
  mounted() {
    //事件全局事件总线接收从Search组件传递过来的参数，赋值给keyword使删除关键字后input里面为空
    //接收的data就是传递过来的参数
    this.$bus.$on("clear", (data) => {
      this.keyword = data;
    });
    //接收登陆成功后获取到的用户信息
    this.$bus.$on("getUserInfo", (data) => {
      this.userInfo = data;
      //把获取到的用户信息用本地存储 存储起来 防止路由跳转刷新的时候用户信息消失
      window.sessionStorage.setItem("USERINFO", JSON.stringify(data));
    });
    //挂载完毕后就把用户信息获取过来
    this.userInfo = JSON.parse(window.sessionStorage.getItem("USERINFO"));
  },
};
</script>

<style lang="less" scoped>
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>