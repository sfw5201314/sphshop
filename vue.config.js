module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: "http://gmall-h5-api.atguigu.cn", //目标服务器
        // changeOrigin: true,//是否改变请求源
        // pathRewrite: { //路径重写
        //   "^/api": ''
        // }
      }
    }
  }
}