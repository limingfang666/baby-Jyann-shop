<template>
	<view class="home-box">
		<!-- 标题区 -->
		<view class="navigate-title">
			<image class="image-title" src="/static/title.png"></image>
			<text class="title">宝酱小铺</text>
		</view>
		<!-- 搜索框区 -->
		<bjs-search class="search-box" :searchHistory="searchHistory" @search="search"></bjs-search>

		<!-- 未登录区 -->
		<bjs-search v-if="showLoginArea" :cancel='true' :hasIcon="false" height='100rpx' radius='60rpx' placeholder="登录后可享受更多优惠福利哦"
			class="login-box" :bgColor="'rgba(121, 121, 121, 0.8)'">
			<template v-slot:button>
				<view class="login-btn">
					<button type="default" @click="login">登录</button>
					<uni-icons class="cancel" type="closeempty" @click="cancel" color='#FFF'></uni-icons>
				</view>

			</template>
		</bjs-search>

		<!-- 轮播图区-->
		<swiper v-if="swiperList" class="swiper-box" :indicator-dots="true" indicator-color="rgba(238, 238, 238, 0.3)"
			circular indicator-active-color="rgba(238, 238, 238, 1)" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="item in swiperList" :key="item.goods_id">
				<navigator class="swiper-list" :url="'/packageGoods/goods-detail/goods-detail?goods_id='+item.goods_id"
					open-type="navigate">
					<image class="swiper-image" :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>

		<!-- 类目展示区 -->
		<scroll-view v-if="categoryList" class="category-box" scroll-y="true" refresher-background="green" enable-flex
			scroll-anchoring="true" show-scrollbar="true" scroll-left="120" scroll-with-animation>
			<navigator class="category-item" url="/pages/categories/categories" open-type="switchTab"
				v-for="item in categoryList" :key="item.name">
				<image class="category-image" :src="item.image_src" mode="scaleToFill"></image>
			</navigator>
		</scroll-view>

		<!-- 楼层区-->
		<view v-if="floordataList" class="floor-box" v-for="(item,index) in floordataList" :key="index">
			<view class="floor-title">
				<image class="floor-image" :src="item.floor_title.image_src"></image>
			</view>
			<view class="floor-image">
				<navigator class="floor-image-left" :url="'/packageGoods/goods-list/goods-list'" open-type="navigate">
					<image class="image-left" :src="item.product_list[0].image_src" mode="scaleToFill"></image>
				</navigator>
				<navigator class="floor-image-right" :url="'/packageGoods/goods-list/goods-list'" open-type="navigate">
					<block v-for="(floor,i) in item.product_list" :key="i">
						<image v-if="i!==0" class="image-right" :src="floor.image_src" mode="scaleToFill"></image>
					</block>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getSwiper,
		getCategories,
		getFloordata
	} from "@/api/api";
	import {
		unifyRequest
	} from '@/composables/unify-request'
	import {
		setTabBarInfo
	} from "@/composables/tabBar-logoInfo"
	import {
		useUserStore
	} from "@/store/pinia/user"
	import {
		mapState
	} from 'pinia'

	export default {
		computed:{
			...mapState(useUserStore, ['token']),
		},
		data() {
			return {
				swiperList: [],
				searchHistory: ['口红', '奶粉', '婴儿车', '洗衣液'],
				categoryList: [],
				floordataList: [],
				showLoginArea: false,
			};
		},
		onLoad() {
			this.getSwiperList();
			this.getCategoryList();
			this.getFloordataList();
			// 给tabBar页面设置徽标
			setTabBarInfo();
			
			// 如果没有登录显示跳转登录窗口
			if(this.token==='') this.showLoginArea = true;
		},
		onShow() {
			this.getSwiperList();
			this.getCategoryList();
			this.getFloordataList();
		},
		methods: {
			async getSwiperList() {
				const {
					list
				} = await unifyRequest(getSwiper, {}, "首页轮播图请求失败");
				this.swiperList = list;
			},
			async getCategoryList() {
				const {
					list
				} = await unifyRequest(getCategories, {}, "首页分类请求失败");
				this.categoryList = list;
			},
			async getFloordataList() {
				const {
					list
				} = await unifyRequest(getFloordata, {}, "首页楼层请求失败");
				this.floordataList = list;
			},
			search() {
				// 跳转到非tabBar页面
				uni.navigateTo({
					url: '/packageSearch/search/search'
				})
			},
			login() {
				uni.navigateTo({
					url: '/packageUser/login/login'
				})
			},
			cancel(){
				// 关闭登录窗口
				this.showLoginArea = false;
			}

		}
	}
</script>

<style lang="scss">
	// 使用字体库
	@font-face {
		font-family: "titletFont";
		font-weight: 700;
		src: url("@/static/ttf/csnDrGcXbDLS.woff2") format("woff2"),
			url("@/static/ttf/Ft3IHsNvx5wV.woff") format("woff");
		font-display: swap;
	}

	.home-box {
		height: 750rpx;
		position: relative;

		.navigate-title {
			position: absolute;
			top: 80rpx;
			z-index: 1;
			margin: 0 20rpx;
			height: 50rpx;
			display: flex;

			.image-title {
				width: 50rpx;
				height: 50rpx;
				line-height: 50rpx;
				border-radius: 50rpx;
				// 去除图片底部缝隙，设置和文字横向对齐
				display: block;
			}

			.title {
				margin-left: 3px;
				font-size: 20px;
				height: 50rpx;
				line-height: 50rpx;
				color: white;
				font-weight: bold;
				font-family: titletFont;
				text-shadow: 2px #efefef;
			}
		}

		.swiper-box {
			height: 100%;
			width: 100%;

			.swiper-list {
				height: 100%;
				width: 100%;

				.swiper-image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.search-box {
			display: flex;
			position: absolute;
			top: 150rpx;
			z-index: 1;
			margin: 0 30rpx;
		}

		.login-box {
			position: fixed;
			bottom: 24rpx;
			z-index: 1;
			margin: 0 30rpx;
		}

		.category-box {
			width: 100%;
			height: 200rpx;
			margin-top: 16px;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;

			.category-item {
				width: 25%;
				height: 80%;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				align-items: center;

				.category-image {
					width: 90%;
					height: 100%;
				}
			}
		}

		.floor-box {
			width: 100%;
			height: 500rpx;
			margin-bottom: 20px;

			.floor-title {
				height: 13%;

				.floor-image {
					height: 65rpx;
					margin-left: 3px;
				}
			}

			.floor-image {
				display: flex;
				width: 100%;
				height: 87%;

				.floor-image-left {
					width: 33%;
					height: 100%;
					margin-left: 10px;

					.image-left {
						width: 100%;
						height: 100%;
					}
				}

				.floor-image-right {
					width: 66%;
					height: 100%;
					display: flex;
					flex-wrap: wrap;
					justify-content: flex-start;

					.image-right {
						// 所有图片间距相等：父级使用flex布局，和默认justify-content: flex-start;子级使用margin调间距宽度
						margin-left: 10px;
						width: 44%;
						height: 48%;
						padding-bottom: 20rpx;
					}
				}
			}
		}
	}

	// 重写button样式
	button[type=default] {
		background-color: #bc2840;
		color: #FFF;
		height: 80rpx;
		line-height: 80rpx;
	}

	// cancel按钮
	.login-btn {
		margin-left: 8px;
		width: 30%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	// 登录框padding值
	.bjs-search-box .placeholder{
		padding-left: 20px;
	}
</style>