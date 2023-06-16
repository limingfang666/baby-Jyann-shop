import { $http } from '@escook/request-miniprogram'

$http.baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';

// 请求拦截器
$http.beforeRequest = function () {
  wx.showLoading({
    title: '数据加载中...',
  })
}

$http.afterRequest = function () {
  wx.hideLoading()
}
uni.$http = $http;

// 首页

/**
 * 获取首页轮播图数据
 */
export const getSwiper = async () =>{
	return await uni.$http.get('/home/swiperdata');
}

/**
 * 获取首页分类数据
 */
export const getCategories = async () =>{
	return await uni.$http.get('/home/catitems');
}

/**
 * 获取楼层分类数据
 */
export const getFloordata = async () =>{
	return await uni.$http.get('/home/floordata');
}

// 分类页
/**
 * 获取商品分类
 */
export const getCategoryData = async () =>{
	return await uni.$http.get('/categories');
}

// 搜索
/**
 * 搜索建议
 */
export const getSearchAdvise = async (data) =>{
	return await uni.$http.get('/goods/qsearch?query='+data);
}

// 商品
/**
 * 商品列表
 */
export const getGoodsList = async (data) =>{
	return await uni.$http.get('/goods/search',data);
}

/**
 * 商品详情
 */
export const getGoodsDetailList = async (data: object) =>{
	return await uni.$http.get('/goods/detail', data);
}





// import request from "@/api/request"

// // 首页

// /**
//  * 获取首页轮播图数据
//  */
// export const getSwiper = () =>{
// 	return request({url:'/home/swiperdata'});
// }

// /**
//  * 获取首页分类数据
//  */
// export const getCategories = () =>{
// 	return request({url:'/home/catitems'});
// }

// /**
//  * 获取楼层分类数据
//  */
// export const getFloordata = async () =>{
// 	return request({url:'/home/floordata'});
// }

// // 分类页
// /**
//  * 获取商品分类
//  */
// export const getCategoryData = () =>{
// 	return request({url:'/categories'});
// }

// // 搜索
// /**
//  * 搜索建议
//  */
// export const getSearchAdvise = (data) =>{
// 	return request({url:'/goods/qsearch?query='+data});
// }

// // 商品
// /**
//  * 商品列表
//  */
// export const getGoodsList = (data) =>{
// 	return request({url:'/goods/search',data:data});
// }







