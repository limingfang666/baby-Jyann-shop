import { $http } from '@escook/request-miniprogram'

$http.baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';

// 请求拦截器
$http.beforeRequest = function (options) {
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
	console.log(data);
	return await uni.$http.get('/goods/qsearch?query='+data);
}




