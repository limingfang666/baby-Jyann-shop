<template>
	<view class="category-box">
		<!-- 搜索栏：固定 -->
		<view class="bjs-box">
			<bjs-search :customIcon="true" placeholder="搜索" bgColor="#f1f1f1" iconColor="black"></bjs-search>
		</view>

		<!-- 商品展示区 -->
		<view class="category" :style="'height:'+ categoryHeight" v-if="categoryList.length>0">
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
				:scroll-with-animation="true">
				<view class="category-content-box" v-for="(secondCategory,index) in secondCateList"
					:key="secondCategory.cat_id">
					<!-- 轮播图 -->
					<swiper class="swiper-box" circular :autoplay="true" :interval="3000" :duration="1000">
						<swiper-item class="swiper-content" v-for="(thirdCategory,index) in secondCategory.children" :key="thirdCategory.cat_id">
							<view class="swiper-item">
								<image class="swiper-image" :src="thirdCategory.cat_icon"></image>
							</view>
						</swiper-item>
					</swiper>
					<view class="category-second">
						<view class="second-title">{{secondCategory.cat_name}}</view>
						<uni-icons type="right" size="18" color="#9e9e9e"></uni-icons>
					</view>
					<view class="category-third">
						<view class="third-content" v-for="(thirdCategory,index) in secondCategory.children"
							:key="thirdCategory.cat_id">
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

	export default {
		data() {
			return {
				categoryList: [],
				categoryHeight: 0,
				isActive: 0,
				secondCateList: [],
				thirdCateList: [],
				swiperList:[],
			};
		},
		async onLoad() {
			await this.getCategoryList();
			this.getContentHeight();
			this.clickFirstCategory(0);
		},
		methods: {
			async getCategoryList() {
				const {
					list
				} = await unifyRequest(getCategoryData);
				this.categoryList = list;
				
			},
			getContentHeight() {
				// 内容区的高度根据wx.getSystemInfoSync()动态获取：总高度-navigateBar高度-自定义组件高度
				const res = wx.getSystemInfoSync();
				this.categoryHeight = (res.windowHeight - 48) + 'px';
			},
			clickFirstCategory(index) {
				this.isActive = index;
				// 点击过快时，商品展示报错（找不到children）
				if (this.categoryList.length > 0 && this.categoryList[index])
					this.secondCateList = this.categoryList[index].children;
				if (this.secondCateList.length > 0 && this.secondCateList[index])
					this.thirdCateList = this.secondCateList[index].children;
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

				.category-content-box {
					display: flex;
					flex-direction: column;
					width: 100%;
					height: fit-content;
					border-bottom: 0.5px solid #e8e8e8;
					margin: 10px 0;
					
					.swiper-box{
						width: 100%;
						height: 120px;
						margin: 10px 0;
						
						.swiper-content{
							width: 100%;
							height: 100%;
							
							.swiper-item{
								width: 100%;
								height: 100%;
								display: flex;
								justify-content: center;
								
								.swiper-image{
									width: 80%;
									height: 100%;
								}
							}
						}
					}

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