<template>
<!-- 	<bjs-search class="search-box" :bgColor="'rgba(255, 255, 255, 1)'" width="710rpx" height="160rpx" :customIcon="true"
		:iconType="'left'">
		<template #down-button class="button-box">
			<view class="keyword" @click="find('美食')">
				美食
			</view>
			<view class="keyword" @click="find('休闲娱乐')">
				休闲娱乐
			</view>
			<view class="keyword" @click="find('交通')">
				交通
			</view>
			<view class="keyword" @click="find('酒店')">
				酒店
			</view>
			<view class="keyword" @click="find('购物')">
				购物
			</view>
		</template>
	</bjs-search> -->

	<!--定义页面结构，可以使用地图组件也能使用其他组件 -->
<!-- 	<map id="map" class="map" :show-location="true" :latitude="latitude" :longitude="longitude"
		:style="'height:'+contentHeight+'px'"></map> -->
	<!-- <uni-badge class="uni-badge-left-margin" text="1" /> -->
	<uni-indexed-list :options="list" :showSelect="false" @click="bindClick"></uni-indexed-list>
	<!-- <uni-indexed-list v-for="city in cityData" :key="city.value" :options="city.data" :showSelect="false" @click="bindClick"></uni-indexed-list> -->
</template>

<script>
	import {
		setTabBarInfo
	} from "@/composables/tabBar-logoInfo"
	import {
		getSystemHeight
	} from "@/utils/common"

	import {
		AMapWX
	} from '@/utils/location/amap-wx.130.js'
	import proviceData from "@/data/city-china.json";
	
	import { createOrder } from "@/api/api";
	import to from "await-to-js"

	export default {
		data() {
			return {
				amapKey: '7dfd30800422c5d0290543719a00f1fe',
				latitude: 23.099994,
				longitude: 113.324520,
				orderParams: {
					order_price: 0.01,
					consignee_addr: '',
					order_detail: "",
					goods: [{
						goods_id: 0,
						goods_number: 0,
						goods_price: 0.01
					}],
				},
				cityData: proviceData,
				list:[{
	"letter": "A",
	"data": [
		"阿克苏机场",
		"阿拉山口机场",
		"阿勒泰机场",
		"阿里昆莎机场",
		"安庆天柱山机场",
		"澳门国际机场"
	]
}, {
	"letter": "B",
	"data": [
		"保山机场",
		"包头机场",
		"北海福成机场",
		"北京南苑机场",
		"北京首都国际机场"
	]
}]
			};
		},
		computed: {
			contentHeight() {
				return getSystemHeight();
			}
		},
		onReady() {

		},
		async onLoad() {
			// 获取启动时参数
			// let params = uni.getLaunchOptionsSync();
			// console.log(params);
			
			// 给tabBar页面设置徽标
			setTabBarInfo();
			

			// 获取地理信息
			const _This = this;
			let amapFun = new AMapWX({
				key: this.amapKey
			});
			amapFun.getRegeo({
				success: function(data) {
					console.log(data);
					_This.latitude = data[0].latitude;
					_This.longitude = data[0].longitude;
					console.log(_This.latitude, _This.longitude);
				},
				fail: function(info) {
					console.log(info);
				}
			})
			amapFun.getPoiAround({
				success: function(data) {
					//成功回调
					console.log(data);
				},
				fail: function(info) {
					//失败回调
					console.log(info)
				}
			})
			
			// 测试封装request
			// try{
			// 	const res = await createOrder(this.orderParams);
			// 	console.log(res);
			// }catch(e){
			// 	console.log("错误信息：",e);
			// }
			// 使用await-to-js优雅的处理try catch
			const [err, res] = await to(createOrder(this.orderParams));
			console.log(err,res);
		},
		methods: {
			find(keyword) {
				const _This = this;
				let amapFun = new AMapWX({
					key: this.amapKey
				});

				amapFun.getPoiAround({
					querykeywords: keyword,
					success: function(data) {
						//成功回调
						console.log(data);
						_This.latitude = data.markers[0].latitude;
						_This.longitude = data.markers[0].longitude;
					},
					fail: function(info) {
						//失败回调
						console.log(info)
					}
				})
			},
			bindClick(){
				console.log("select city");
				
			}
		}
	}
</script>

<style lang="scss">
	.search-box {
		position: fixed;
		top: 50rpx;
		left: 10px;
		z-index: 2;

		.keyword {
			width: 50px;
			background-color: rgba(238, 238, 238, 0.3);
			border-radius: 5px;
		}
	}

	.button-box {
		display: flex;
	}

	.map {
		flex: 1;
		width: 100%;
	}
</style>