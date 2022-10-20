//对axios进行二次封装
import axios from 'axios'
//引入进度条
import nprogress from 'nprogress'
// console.log(npropress);

//引入进度条相关的样式
import 'nprogress/nprogress.css'
import store from '@/store/index'
//start代表进度条开始的方法 done代表进度条结束的方法
//1.利用axios的对象方法create去创建一个axios实例
//2.request就是axios只不过可以稍微配置一下
const request = axios.create({
  //配置对象
  //基础路径：发请求的时候路径当中会出现api
  baseURL: '/api',
  //代表请求超时的时间为5秒
  timeout: 5000
})
//请求拦截器：在发请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些操作
request.interceptors.request.use((config) => {
  //config是一个配置对象 里面有一个属性 header请求头
  //把uuid加入到请求头里面
  if (store.state.detail.uuid_token) {
    //给请求头添加一个字段(userTempId)
    config.headers.userTempId = store.state.detail.uuid_token
  }

  //把用户登陆时候的token加入到请求头里面去 登陆成功可以获取用户信息
  let user_token = window.localStorage.getItem("USER_TOKEN")
  // console.log(user_token);
  if (user_token) {
    //给请求头添加一个字段(token)
    config.headers.token = user_token
  }
  //进度条开始动
  nprogress.start();
  // console.log(store);
  // console.log(store.state.detail.uuid_token);
  // let a = localStorage.getItem("UUIDTOKEN")
  // console.log(a);
  return config
})

//响应拦截器
request.interceptors.response.use((res) => {
  //服务器成功的回调函数，服务器响应数据回来以后，响应拦截器可以检测到，可以做一些操作
  //进度条结束
  nprogress.done()
  return res.data
}, (error) => {
  //服务器响应失败的回调函数
  return Promise.reject(new Error('faile'))
})


//对外暴露axios
export default request