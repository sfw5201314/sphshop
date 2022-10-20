//引入mockjs
import Mock from 'mockjs';
//引入我们的json格式文件 json文件不用对外暴露
//webpack默认对外暴露的文件:图片、json数据格式
import banner from '../mock/banner.json';
import floor from '../mock/footers.json';

//mock数据 Mock是一个对象
//第一个参数是请求地址 第二个参数是请求数据
Mock.mock('/mock/banner', { code: 200, data: banner });//模拟首页轮播图的数据
Mock.mock("/mock/floor", { code: 200, data: floor });//模拟floor的数据

