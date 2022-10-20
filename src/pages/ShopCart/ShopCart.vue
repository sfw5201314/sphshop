<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul
          class="cart-list"
          v-for="(item, index) in cartInfoList"
          :key="item.id"
        >
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="item.isChecked == 1"
              @change="changeCheck(item.skuId, item.isChecked)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="item.imgUrl" />
            <div class="item-msg">
              {{ item.skuName }}
            </div>
          </li>

          <li class="cart-list-con4">
            <span class="price">{{ item.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a
              href="javascript:void(0)"
              class="mins"
              @click="changeSkuNum('jianshao', item.skuId, -1, item.skuNum)"
              >-</a
            >
            <input
              autocomplete="off"
              type="text"
              :value="item.skuNum"
              minnum="1"
              class="itxt"
              @change="
                changeSkuNum(
                  'change',
                  item.skuId,
                  $event.target.value * 1,
                  item.skuNum
                )
              "
            />
            <a
              href="javascript:void(0)"
              class="plus"
              @click="changeSkuNum('add', item.skuId, 1, item.skuNum)"
              >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ item.skuNum * item.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a
              href="javascript:void(0)"
              class="sindelet"
              @click="deleteGoods(item.skuId)"
              >删除</a
            >
            <br />
            <a href="javascript:void(0)">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isChecked"
          @change="isChoosAll"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a href="javascript:void(0)" @click="deleteAll">删除选中的商品</a>
        <a href="javascript:void(0)">移到我的关注</a>
        <a href="javascript:void(0)">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <a class="sum-btn" href="javascript:void(0)" @click="goTrade">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  deleteShopCartGoods,
  reqAddOrupDateShopCart,
  changeCheckCart,
} from "@/api/index";
import throttle from "lodash/throttle";
export default {
  name: "ShopCart",
  data() {
    return {
      isCheckedAll: false,
    };
  },
  mounted() {
    // console.log(this.cartList);
    this.getData();
  },
  methods: {
    //获取个人购物车数据
    getData() {
      this.$store.dispatch("getCartList");
    },
    //删除购物车商品数据
    async deleteGoods(skuId) {
      console.log(skuId);
      const result = await deleteShopCartGoods(skuId);
      console.log(result);
      if (result.code === 200) {
        this.getData();
      } else {
        return Promise.reject(new Error("faile"));
      }
    },
    //修改产品的个数 这里使用了节流 throttle
    changeSkuNum: throttle(async function (type, skuId, skuNum, itemSkuNum) {
      console.log(type, skuId, "-----" + itemSkuNum);
      // console.log(itemSkuNum);
      // console.log(skuNum);
      //这里分类判断skuNum的值应该是多少
      switch (type) {
        //点击+
        case "add":
          //带给服务器变化的量
          skuNum = 1;
          break;
        //点击-
        case "jianshao":
          //判断产品个数大于1才给服务器传-1这个参数
          if (itemSkuNum > 1) {
            skuNum = -1;
          } else {
            skuNum = 0;
          }
          break;
        //修改输入框的值时
        case "change":
          //如果用户输入的最终的量是一个非法的值 非数字 这时应该不变
          if (isNaN(skuNum) || skuNum < 1) {
            skuNum = 0;
          } else {
            //是把最终的量减去服务器原有的量就等于药修改的量
            //因为输入框输入的skuNum是输入值加上服务器的量的值
            skuNum = parseInt(skuNum) - itemSkuNum;
          }
          break;
      }
      console.log(skuNum);
      console.log(itemSkuNum);
      //上面处理好skuNum的值后发送请求修改商品参数
      const result = await reqAddOrupDateShopCart(skuId, skuNum);
      console.log(result);
      if (result.code == 200) {
        this.getData();
      }
    }, 1000),
    // async changeSkuNum(type, skuId, skuNum, itemSkuNum) {
    //   console.log(type, skuId, "-----" + itemSkuNum);
    //   // console.log(itemSkuNum);
    //   // console.log(skuNum);
    //   //这里分类判断skuNum的值应该是多少
    //   switch (type) {
    //     //点击+
    //     case "add":
    //       //带给服务器变化的量
    //       skuNum = 1;
    //       break;
    //     //点击-
    //     case "jianshao":
    //       //判断产品个数大于1才给服务器传-1这个参数
    //       if (itemSkuNum > 1) {
    //         skuNum = -1;
    //       } else {
    //         skuNum = 0;
    //       }
    //       break;
    //     //修改输入框的值时
    //     case "change":
    //       //如果用户输入的最终的量是一个非法的值 非数字 这时应该不变
    //       if (isNaN(skuNum) || skuNum < 1) {
    //         skuNum = 0;
    //       } else {
    //         //是把最终的量减去服务器原有的量就等于药修改的量
    //         //因为输入框输入的skuNum是输入值加上服务器的量的值
    //         skuNum = parseInt(skuNum) - itemSkuNum;
    //       }
    //       break;
    //   }
    //   console.log(skuNum);
    //   console.log(itemSkuNum);
    //   //上面处理好skuNum的值后发送请求修改商品参数
    //   const result = await reqAddOrupDateShopCart(skuId, skuNum);
    //   console.log(result);
    //   if (result.code == 200) {
    //     this.getData();
    //   }
    // },
    //修改商品的状态
    async changeCheck(skuId, isChecked) {
      console.log(skuId, isChecked);
      switch (isChecked) {
        case 1:
          isChecked = 0;
          break;
        case 0:
          isChecked = 1;
          break;
      }
      console.log(isChecked);
      const result = await changeCheckCart(skuId, isChecked);
      if (result.code == 200) {
        this.getData();
      }
    },
    //全选商品
    isChoosAll: throttle(async function (e) {
      let isChecked = 0;
      //循环遍历this.cartInfoList如果当前全选框的checked为true 就把isChecked进行修改
      //使用循环遍历发送请求传递遍历出来的skuId和修改的isChecked发送请求修改服务器里面的isChecked修改全选状态
      this.cartInfoList.forEach(async (element) => {
        console.log(element.isChecked);
        switch (e.target.checked) {
          case true:
            isChecked = 1;
            break;
          case false:
            isChecked = 0;
            break;
        }
        const result = await changeCheckCart(element.skuId, isChecked);
        if (result.code == 200) {
          this.getData();
        } else {
          alert("error");
        }
      });
      console.log(e.target.checked);
    }, 1000),
    // isChoosAll(e) {
    //   let isChecked = 0;
    //   //循环遍历this.cartInfoList如果当前全选框的checked为true 就把isChecked进行修改
    //   //使用循环遍历发送请求传递遍历出来的skuId和修改的isChecked发送请求修改服务器里面的isChecked修改全选状态
    //   this.cartInfoList.forEach(async (element) => {
    //     console.log(element.isChecked);
    //     switch (e.target.checked) {
    //       case true:
    //         isChecked = 1;
    //         break;
    //       case false:
    //         isChecked = 0;
    //         break;
    //     }
    //     const result = await changeCheckCart(element.skuId, isChecked);
    //     if (result.code == 200) {
    //       this.getData();
    //     } else {
    //       alert("error");
    //     }
    //     // if (e.target.checked === true) {
    //     //   isChecked = 1;
    //     //   const result = await changeCheckCart(element.skuId, isChecked);
    //     //   if (result.code == 200) {
    //     //     this.getData();
    //     //   } else {
    //     //     alert("error");
    //     //   }
    //     // }
    //   });
    //   console.log(e.target.checked);
    // },
    //删除选中的全部商品
    deleteAll() {
      //遍历this.cartInfoList里面的isChecked属性 循环删除ischecked==1的商品
      this.cartInfoList.forEach(async (element) => {
        console.log(element.isChecked);
        if (element.isChecked == 1) {
          //如果ischecked为1表示选中 然后把为1的商品id传过去发送请求删除
          const result = await deleteShopCartGoods(element.skuId);
          if (result.code == 200) {
            this.getData();
          } else {
            return Promise.reject(new Error("faile"));
          }
        }
      });
    },
    goTrade() {
      this.$router.push("/trade");
    },
  },
  computed: {
    ...mapGetters(["cartList"]),
    cartInfoList() {
      return this.cartList.cartInfoList || [];
    },
    //判断复选框是否全部勾选
    isChecked() {
      // this.cartInfoList.forEach((element) => {
      //   // console.log(element.isChecked);
      //   if (element.isChecked === 1) {
      //     this.isCheckedAll = true;
      //   } else {
      //     this.isCheckedAll = false;
      //   }
      // });
      // return this.isCheckedAll;

      //every遍历数组里面的原理 只要元素里面的isChecked属性都为==1那么就返回为真
      //如果元素里面的isChecked属性有一个不==1那么返回就为假
      return this.cartInfoList.every((item) => item.isChecked == 1);
    },
    //计算购买商品的总价
    totalPrice() {
      //定义商品总价
      let sum = 0;
      //循环遍历数组中的价格和数量然后相加
      this.cartInfoList.forEach((element) => {
        // console.log(element.skuPrice);
        sum += element.skuPrice * element.skuNum;
      });
      return sum;
    },
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>