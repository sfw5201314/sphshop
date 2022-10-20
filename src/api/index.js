//当前这个模块 将所以的API接口进行统一管理

//引入二次封装好的axios
import requests from './request'
//引入封装好的mock数据的axios
import MockRequest from './mockRequest'
import request from './request'
//三级联动接口 请求地址/api/product/getBaseCategoryList 请求方式get 无参数
export const reqCategoryList = () => {
  //发请求 返回的结果是promise对象
  return requests({ url: '/product/getBaseCategoryList', method: 'get' })
}
//获取banner首页轮播图的接口
export const reqMockBanner = () => {
  return MockRequest({ url: '/banner', method: 'get' })
}

//获取floor数据的接口
export const reqMockFloor = () => {
  return MockRequest.get("/floor")
}

//获取搜索模块数据
export const reqGetSearchInfo = (params) => {
  return requests({ url: "/list", method: 'post', data: params })
}
//获取商品详情页模块数据
export const reqGetDetailInfo = (skuId) => {
  return requests({ url: `/item/${skuId}`, method: "get" })
}
//将产品添加到购物车中或者进行购物车中产品数量的更新
export const reqAddOrupDateShopCart = (skuId, skuNum) => {
  return requests({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: "post" })
}
//获取购物车列表
export const reqGetShopCartList = () => {
  return requests({ url: "/cart/cartList", method: "get" })
}
//删除购物车商品数据
export const deleteShopCartGoods = (skuId) => {
  return requests({ url: `/cart/deleteCart/${skuId}`, method: "delete" })
}
//切换商品选中状态
export const changeCheckCart = (skuID, isChecked) => {
  return requests({
    url: `/cart/checkCart/${skuID}/${isChecked}`, method: "get"
  })
}
//获取注册验证码
export const getRegisterCode = (phone) => {
  return requests({
    url: `/user/passport/sendCode/${phone}`, method: "get"
  })
}
//注册用户
export const registerUser = (phone, password, code) => {
  return requests({
    url: "/user/passport/register", method: "post", data: {
      phone: phone,
      password: password,
      code: code
    }
  })
}
//登陆
export const login = (phone, password) => {
  return requests({
    url: "/user/passport/login", method: "post", data: {
      phone: phone,
      password: password,
    }
  })
}
//使用token获取用户登陆后的信息
export const getUserInfo = () => {
  return requests({
    url: "/user/passport/auth/getUserInfo", method: "get"
  })
}
//退出登陆
export const reqLoginOut = () => {
  return requests({
    url: "/user/passport/logout", method: "get"
  })
}
//获取订单交易页面信息用户地址信息
export const getTradeInfo = () => {
  return requests({
    url: "/user/userAddress/auth/findUserAddressList", method: "get"
  })
}