import { $http } from '@escook/request-miniprogram';

$http.baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';
import {
	useUserStore
} from "@/store/pinia/user"
const store = useUserStore();

import request from "@/api/request";

// 请求拦截器
$http.beforeRequest = function (options) {
	// 特定的接口需要设置token
	if (options.url.indexOf('/my') !== -1) {
		options.header = {
			"Authorization": store.$state.token,
		}
	}
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
export const getSwiper = async () => {
	return await uni.$http.get('/home/swiperdata');
}

/**
 * 获取首页分类数据
 */
export const getCategories = async () => {
	return await uni.$http.get('/home/catitems');
}

/**
 * 获取楼层分类数据
 */
export const getFloordata = async () => {
	return await uni.$http.get('/home/floordata');
}

// 分类页
/**
 * 获取商品分类
 */
export const getCategoryData = async () => {
	return await uni.$http.get('/categories');
}

// 搜索
/**
 * 搜索建议
 */
export const getSearchAdvise = async (data) => {
	return await uni.$http.get('/goods/qsearch?query=' + data);
}

// 商品
/**
 * 商品列表
 */
export const getGoodsList = async (data) => {
	return await uni.$http.get('/goods/search', data);
}

/**
 * 商品详情
 */
export const getGoodsDetailList = async (data : object) => {
	return await uni.$http.get('/goods/detail', data);
}

//登录
/**
 * 获取token
 */
export const getToken = async (data : object) => {
	return await uni.$http.post('/users/wxlogin', data);
}


//订单API
/**
 * 创建订单
 */
export const createOrder = async (data: object) => {
	return request({url:'/my/orders/create',data,method:'POST'});
	// return await uni.$http.post('/my/orders/create',data);
}

/**
 * 订单预支付
 */
export const prepayOrder = async (data: object) => {
	return await uni.$http.post('/my/orders/req_unifiedorder',data);
}

/**
 * 订单支付状态查询
 */
export const getPaymentStatus = async (data: object) => {
	return await uni.$http.post('/my/orders/chkOrder',data);
}

/**
 * 订单查询
 */
export const getOrder = async (data: object) => {
	// return await uni.$http.get('/my/orders/all',data);
	return request({url:'/my/orders/all',data});
}

