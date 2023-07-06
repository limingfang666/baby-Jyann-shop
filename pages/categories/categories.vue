<template>
	<view class="category-box">
		<!-- 搜索栏：固定 -->
		<view class="bjs-box">
			<bjs-search :customIcon="true" placeholder="搜索" bgColor="#f1f1f1" iconColor="black"
				@search="search"></bjs-search>
		</view>

		<!-- 商品展示区 -->
		<view class="category" :style="'height:'+ contentHeight" v-if="categoryList.length>0">
			<!--scroll-view各个属性设置时必须使用:bind形式  -->
			<!-- 左侧菜单栏 -->
			<scroll-view class="category-first" :enable-flex="true" scroll-y :show-scrollbar="false"
				:scroll-with-animation="true">
				<view @click="clickFirstCategory(index)" :class="['first-item',isActive===index?'active':'']"
					v-for="(category,index) in categoryList" :key="category.cat_id">
					{{category.cat_name}}
				</view>
			</scroll-view>

			<!-- 右侧商品列表 -->
			<scroll-view class="category-content" :enable-flex="true" scroll-y :show-scrollbar="false"
				:scroll-top="scrollToTop" :scroll-with-animation="true">
				<!--:scroll-top="scrollToTop" :scroll-with-animation="true">  -->
				<!-- 轮播图 -->
				<swiper class="swiper-box" circular :autoplay="true" :interval="3000" :duration="1000"
					v-if="secondCateList.length>0 && secondCateList[0].children.length>0">
					<swiper-item class="swiper-content" v-for="swiperItem in secondCateList[0].children"
						:key="swiperItem.cat_id">
						<view class="swiper-item">
							<image class="swiper-image" :src="swiperItem.cat_icon"></image>
						</view>
					</swiper-item>
				</swiper>
				<view class="category-content-box" v-for="(secondCategory,index) in secondCateList"
					:key="secondCategory.cat_id">
					<view class="category-second">
						<view class="second-title">{{secondCategory.cat_name}}</view>
						<uni-icons type="right" size="18" color="#9e9e9e"></uni-icons>
					</view>
					<view class="category-third">
						<!-- 点击进入商品列表 -->
						<view class="third-content" v-for="(thirdCategory,index) in secondCategory.children"
							:key="thirdCategory.cat_id"
							@click="gotoGoodsList(thirdCategory.cat_id,thirdCategory.cat_name)">
							<image class="third-image" :src="thirdCategory.cat_icon"></image>
							<text class="third-text">{{thirdCategory.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>

		</view>
	</view>
</template>

<script>
	import {
		getCategoryData
	} from "@/api/api";
	import {
		unifyRequest
	} from '@/composables/unify-request'
	import {
		getSystemHeight
	} from "@/utils/common.js"
	import {
		nextTick
	} from "vue";
	import { setTabBarInfo } from "@/composables/tabBar-logoInfo"

	export default {
		data() {
			return {
				categoryList: [],
				isActive: 0,
				secondCateList: [],
				thirdCateList: [],
				swiperList: [],
				// 保证每次切换，滚动条位置都在最顶部
				scrollToTop: 0,
			};
		},
		async onLoad() {
			await this.getCategoryList();
			this.clickFirstCategory(0);
			// 给tabBar页面设置徽标
			setTabBarInfo();
		},
		computed: {
			contentHeight() {
				return (getSystemHeight() - 48) + 'px';
			}
		},
		methods: {
			async getCategoryList() {
				const {
					list
				} = await unifyRequest(getCategoryData);
				this.categoryList = list;

			},
			clickFirstCategory(index) {
				this.isActive = index;

				if (this.categoryList.length > 0 && this.categoryList[index])
					this.secondCateList = this.categoryList[index].children;
				if (this.secondCateList.length > 0 && this.secondCateList[index])
					this.thirdCateList = this.secondCateList[index].children;

				// 每次点击都保证scroll滚动条在最顶部
				this.scrollToTop = this.scrollToTop ? 0 : 1;
			},
			search() {
				// 跳转到非tabBar页面
				uni.navigateTo({
					url: '/packageSearch/search/search'
				})
			},
			gotoGoodsList(cateId, cateName) {
				uni.navigateTo({
					url: '/packageGoods/goods-list/goods-list?cid=' + cateId + '&query=' + cateName
				})
			}
		}
	}
</script>

<style lang="scss">
	.category-box {
		position: relative;

		.bjs-box {
			height: 40px;
			// 固定元素位置
			position: fixed;
			// 微信小程序的导航栏高度就是44px不
			top: 8rpx;
			left: 20px;
			right: 0;
			bottom: 8rpx;
			margin: 0 auto;
		}

		.category {
			width: 100%;
			display: flex;
			position: absolute;
			top: 48px;

			.category-first {
				width: 25%;
				// scroll-view 竖向滚动必须设置固定高度才能生效，否则会错位
				height: 100%;
				// background-color: #f1f1f1;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				align-items: center;

				.first-item {
					width: 80%;
					padding: 0 10px;
					display: flex;
					justify-content: center;
					align-items: center;
					height: 110rpx;
					line-height: 110rpx;
					font-size: 17px;
					border-bottom: 0.5px solid #e8e8e8;
					background-color: #f1f1f1;

					// 激活项的样式：只有当前项才有伪元素
					&.active {
						background-color: #ffffff;
						position: relative;

						&::before {
							content: "";
							// 必须使用position 绝对定位，否则出不来
							position: absolute;
							top: 0;
							left: 0;
							width: 4px;
							height: 110rpx;
							background-color: #bf2944;
						}
					}
				}

			}

			.category-content {
				width: 75%;
				height: 100%;
				display: flex;
				flex-flow: wrap;
				justify-content: center;
				align-items: center;
				// border-box不包含margin，所以使用padding
				box-sizing: border-box;
				padding: 10px;

				.swiper-box {
					width: 100%;
					height: 110px;
					border-radius: 10px;

					.swiper-content {
						width: 100%;
						height: 100%;

						.swiper-item {
							width: 100%;
							height: 100%;
							display: flex;
							justify-content: center;

							.swiper-image {
								width: 80%;
								height: 100%;
							}
						}
					}
				}

				.category-content-box {
					display: flex;
					flex-direction: column;
					width: 100%;
					height: fit-content;
					border-bottom: 0.5px solid #e8e8e8;
					margin: 10px 0;

					.category-second {
						width: 100%;
						height: 40px;
						display: flex;
						justify-content: space-between;

						.second-title {
							color: #313131;
							font-size: 15px;
							font-weight: bold;
						}

						.second-icon {}
					}

					.category-third {
						width: 100%;
						height: fit-content;
						display: flex;
						flex-wrap: wrap;

						.third-content {
							width: 33%;
							height: 100%;
							display: flex;
							flex-direction: column;
							box-sizing: border-box;
							padding: 8px;

							.third-image {
								width: 100%;
								height: 80px;
							}

							.third-text {
								width: 100%;
								height: 30px;
								font-size: 15px;
								line-height: 20px;
								;
								// word-spacing: no-wrap;
								word-wrap: normal;
								text-align: center
							}
						}



					}
				}



			}
		}
	}
</style>