import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import Home from '@/pages/Home/Home'
import Search from '@/pages/Search/Search'
import Login from '@/pages/Login/Login'
import Register from '@/pages/Register/Register'
import Detail from '@/pages/Detail/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess/AddCartSuccess'
import ShopCart from '@/pages/ShopCart/ShopCart'
import Trade from '@/pages/Trade/Trade'
//重写push和replace方法
//先把vue-router的原型对象保存一份
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace
//重写push方法
//第一个参数告诉push你往哪里跳以及传递哪些参数
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    //call和apply的区别
    // 相同点:都可以调用函数一次，都可以篡改函数的上下文一次
    // 不同点:call与apply传递参数，call传递参数多个参数用逗号隔开，而apply传递参数用数组
    originPush.call(this, location, resolve, reject)
  } else {
    originPush.call(this, location, () => { }, () => { })
  }
}
//重写replace方法
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    //call和apply的区别
    // 相同点:都可以调用函数一次，都可以篡改函数的上下文一次
    // 不同点:call与apply传递参数，call传递参数多个参数用逗号隔开，而apply传递参数用数组
    originReplace.call(this, location, resolve, reject)
  } else {
    originReplace.call(this, location, () => { }, () => { })
  }
}
const router = new VueRouter({
  routes: [
    {
      //设置路由重定向
      path: '/',
      //当打开是/路径时就路由重定向到/home地址
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home,
      //meta路由元信息可以用来设置展示或隐藏Footer的值
      meta: { showFooter: true }
    },
    {
      path: '/search/:keyword?',//使用占位符声明接收params参数
      component: Search,
      name: 'search',
      meta: { showFooter: true, showTypeNav: true }
    },
    {
      path: '/login',
      component: Login,
      name: "Login",
      meta: { showFooter: false }
    },
    {
      path: '/Register',
      name: "Register",
      component: Register,
      meta: { showFooter: false }
    },
    {
      path: "/detail/:skuId?",
      name: "detail",
      component: Detail,
      meta: {
        showFooter: true, showTypeNav: true
      }
    },
    {
      path: '/addCartSuccess',
      name: "AddCartSuccess",
      component: AddCartSuccess,
      meta: { showFooter: true }
    },
    {
      path: '/shopCart',
      name: "ShopCart",
      component: ShopCart,
      meta: { showFooter: true }
    },
    {
      path: '/trade',
      name: "Trade",
      component: Trade,
      meta: { showFooter: true }
    }
  ],
  //滚动行为 路由跳转时滚动到什么位置
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部 y:0代表滚动条在顶端
    return { y: 0 }
  },
})
//设置全局前置守卫
router.beforeEach((to, from, next) => {
  //to可以获取到你要跳转到哪个路由信息
  //from可以获取到你从哪个路由来的路由信息
  //next放行函数 验证通过放行
  let token = window.localStorage.getItem("USER_TOKEN")
  console.log("---------" + token);
  //用户已经登陆获取到了token
  if (token) {
    //用户要去login
    if (to.path == "/login") {
      //路由守卫不能跳转到login 跳转到/ 相当于留在首页
      next("/")
    } else {
      //如果登陆了去的不是login那么全部放行
      next()
    }
  } else {
    //如果用户没有登陆没有token那么就全部放行
    next()
  }
})
export default router
