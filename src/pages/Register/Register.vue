<template>
  <div class="register-container">
    <!-- 注册内容 -->
    <div class="register">
      <h3>
        注册新用户
        <span class="go"
          >我有账号，去 <a href="login.html" target="_blank">登陆</a>
        </span>
      </h3>
      <div class="content">
        <label>手机号:</label>
        <input type="text" placeholder="请输入你的手机号" v-model="phone" />
        <span class="error-msg">{{ errorPhoneMsg }}</span>
      </div>
      <div class="content">
        <label>验证码:</label>
        <input type="text" placeholder="请输入验证码" v-model="code" />
        <button
          style="width: 100px; height: 38px"
          @click="getRegisterCodes(phone)"
        >
          获取验证码
        </button>
        <span class="error-msg">{{ errorCodeMsg }}</span>
      </div>
      <div class="content">
        <label>登录密码:</label>
        <input
          type="text"
          placeholder="请输入你的登录密码"
          v-model="password"
        />
        <span class="error-msg">{{ errorPasswordMsg }}</span>
      </div>
      <div class="content">
        <label>确认密码:</label>
        <input type="text" placeholder="请输入确认密码" v-model="password2" />
        <span class="error-msg">{{ errorPassword2Msg }}</span>
      </div>
      <div class="controls">
        <input name="m1" type="checkbox" ref="checkBox" />
        <span>同意协议并注册《尚品汇用户协议》</span>
      </div>
      <div class="btn">
        <button @click="register(phone, password, code)">完成注册</button>
      </div>
    </div>

    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机尚品汇</li>
        <li>销售联盟</li>
        <li>尚品汇社区</li>
      </ul>
      <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
      <div class="beian">京ICP备19006430号</div>
    </div>
  </div>
</template>

<script>
import { getRegisterCode, registerUser } from "@/api/index";
export default {
  name: "Register",
  data() {
    return {
      //收集表单数据
      phone: "",
      password: "",
      password2: "",
      code: "",
      errorPhoneMsg: "",
      errorCodeMsg: "",
      errorPasswordMsg: "",
      errorPassword2Msg: "",
    };
  },
  methods: {
    //获取验证码
    async getRegisterCodes(phone) {
      console.log(phone);
      let rg = /^[1][3,4,5,7,8][0-9]{9}$/;
      //这里是限制获取验证码的条件必须为手机号不为空并且是合法的手机号
      if (phone !== "" && rg.test(phone)) {
        const result = await getRegisterCode(phone);
        console.log(result);
        if (result.code == 200) {
          this.code = result.data;
        } else {
          alert(result.message);
        }
      } else {
        alert("请输入手机号或合法手机号");
      }
    },
    //完成注册
    async register(phone, password, code) {
      //当勾选同意协议后才能发送请求 如果两次密码不一致也不能发送请求
      if (this.$refs.checkBox.checked == true) {
        if (this.password2 === password) {
          const result = await registerUser(phone, password, code);
          console.log(result);
          if (result.code == 200) {
            alert("注册成功");
            this.$router.push({ name: "Login" });
          } else {
            alert(result.message);
            this.$router.push({ name: "Login" });
          }
        } else {
          alert("输入的密码不一致");
        }
      } else {
        alert("请阅读协议并勾选");
      }
    },
  },
  //使用watach进行表单验证
  watch: {
    //进行手机号的验证
    phone: {
      handler(newValue, oldValue) {
        //手机号的正则表达式
        let rg = /^[1][3,4,5,7,8][0-9]{9}$/;
        console.log(newValue + "----" + oldValue);
        if (newValue !== "") {
          if (!rg.test(newValue)) {
            this.errorPhoneMsg = "输入的手机号不合法";
          } else {
            this.errorPhoneMsg = "";
          }
        } else {
          this.errorPhoneMsg = "请输入手机号";
        }
      },
    },
    //进行验证码的验证
    code: {
      handler(newValue, oldValue) {
        if (newValue !== "") {
          let rg = /^\d{6}$/;
          if (!rg.test(newValue)) {
            this.errorCodeMsg = "输入的验证码不合法";
          } else {
            this.errorCodeMsg = "";
          }
        }
      },
    },
    //进行密码的验证
    password: {
      handler(newValue, oldValue) {
        let rg = /^[a-zA-Z]\w{5,17}$/;
        if (newValue !== "") {
          if (!rg.test(newValue)) {
            this.errorPasswordMsg =
              "密码以字母开头，长度在6-18之间，只能包含字符、数字和下划线";
          } else {
            this.errorPasswordMsg = "";
          }
        } else {
          this.errorPasswordMsg = "请输入密码";
        }
      },
    },
    //进行确认密码的验证
    password2: {
      handler(newValue, oldValue) {
        if (newValue !== "") {
          if (this.password2 !== this.password) {
            this.errorPassword2Msg = "两次密码必须一致";
          } else {
            this.errorPassword2Msg = "";
          }
        } else {
          this.errorPassword2Msg = "请输入确认密码";
        }
      },
    },
  },
};
</script>

<style lang="less" scoped>
.register-container {
  .register {
    width: 1200px;
    height: 445px;
    border: 1px solid rgb(223, 223, 223);
    margin: 0 auto;

    h3 {
      background: #ececec;
      margin: 0;
      padding: 6px 15px;
      color: #333;
      border-bottom: 1px solid #dfdfdf;
      font-size: 20.04px;
      line-height: 30.06px;

      span {
        font-size: 14px;
        float: right;

        a {
          color: #e1251b;
        }
      }
    }

    div:nth-of-type(1) {
      margin-top: 40px;
    }

    .content {
      padding-left: 390px;
      margin-bottom: 18px;
      position: relative;

      label {
        font-size: 14px;
        width: 96px;
        text-align: right;
        display: inline-block;
      }

      input {
        width: 270px;
        height: 38px;
        padding-left: 8px;
        box-sizing: border-box;
        margin-left: 5px;
        outline: none;
        border: 1px solid #999;
      }

      img {
        vertical-align: sub;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .controls {
      text-align: center;
      position: relative;

      input {
        vertical-align: middle;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .btn {
      text-align: center;
      line-height: 36px;
      margin: 17px 0 0 55px;

      button {
        outline: none;
        width: 270px;
        height: 36px;
        background: #e1251b;
        color: #fff !important;
        display: inline-block;
        font-size: 16px;
      }
    }
  }

  .copyright {
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    line-height: 24px;

    ul {
      li {
        display: inline-block;
        border-right: 1px solid #e4e4e4;
        padding: 0 20px;
        margin: 15px 0;
      }
    }
  }
}
</style>