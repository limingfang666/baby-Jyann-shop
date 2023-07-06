<template>
	<view v-if="goodsInfo">
		<scroll-view class="goods-detail-box" :scroll-y="true" :show-scrollbar="true"
			:style="'height:'+goodsNavTop+'px'">
			<swiper class="swiper-box" :interval="3000" :duration="1000">
				<swiper-item class="swiper-list" v-for="(item,index) in goodsInfo.pics" :key="item.pics_id">
					<view class="swiper-view">
						<image class="swiper-image" :src="item.pics_big_url"></image>
						<view class="swiper-pageNum" v-if="goodsInfo.pics">{{index+1}}/{{goodsInfo.pics.length}}</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="price-box">
				<view class="price-left">
					<view class="xianshigou-icon">
						<template v-slot:shop>
							<uni-icons class="" custom-prefix="bjsicons" type="bjs-xianshigou" size="24"></uni-icons>
						</template>
					</view>
					<bjs-price :color="'#FFFFFF'" :price="goodsInfo.goods_price"></bjs-price>
					<view class="old-price" v-if="goodsInfo.goods_price!==''">
						{{getPrice(goodsInfo.goods_price || 0)}}
					</view>
				</view>
				<view class="price-right">
					<view class="countdown-text">距结束</view>
					<uni-countdown class="countdown-icon" :font-size="15" :show-day="false" :hour="2" :minute="30"
						:second="23" color="#bc2840" background-color="#FFFFFF" />
				</view>
			</view>
			<view class="goods-desc">
				<view class="goods-name" v-if="goodsInfo.goods_name">
					<view class="goods-title">{{goodsInfo.goods_name}}</view>
					<view class="goods-feature" v-if="goodsInfo.attrs">
						<view class="goods-feature-item" v-if="goodsInfo.attrs[1].attr_value!==''"
							v-for="(feature,index) in goodsFeature(goodsInfo.attrs[1].attr_value)" :key="index">
							{{feature}}
						</view>
					</view>
				</view>
				<view class="goods-share">
					<template v-slot:arrow-up>
						<uni-icons class="share-icon" custom-prefix="bjsicons" type="bjs-share" size="28"></uni-icons>
					</template>
					<view class="share-text">分享</view>
				</view>
			</view>
			<view class="goods-attr">
				<view class="goods-logo">
					<image class="goods-logo-image" :src="goodsInfo.goods_big_logo" mode="scaleToFill"></image>
				</view>
				<view class="goods-attr-box">
					<view class="sell">
						<view class="sell-title">促销</view>
						<view class="sell-content">满199赠1件</view>
						<uni-icons type="forward"></uni-icons>
					</view>
					<view class="freight">
						<view class="freight-title">运费</view>
						<view class="freight-content">快递：0元起</view>
					</view>
					<view class="service">
						<view class="service-title">服务</view>
						<view class="service-content">正品保证.环保无忧</view>
						<uni-icons type="forward"></uni-icons>
					</view>
					<view class="brand">
						<view class="brand-title">品牌</view>
						<view class="brand-content">woobaby</view>
						<uni-icons type="forward"></uni-icons>
					</view>
				</view>
			</view>
			<view class="bought-box">
				<view class="bought-title">
					<view class="title">已有92人购买</view>
					<view class="view">
						查看全部
						<uni-icons type="forward"></uni-icons>
					</view>
				</view>
				<!-- 文字纵向滚动 -->
				<swiper class="bought-list" circular :vertical="true" :autoplay="true" :interval="4000" :duration="500">
					<swiper-item class="swiper-bought">
						<view class="bought-content">
							<view class="avator">
								<image class="avator-image" src="/static/title.png"></image>
								<view class="nickname">华hua</view>
							</view>
							<view class="bought-info">一小时前购买一件</view>
						</view>
						<view class="bought-content">
							<view class="avator">
								<image class="avator-image" src="/static/title.png"></image>
								<view class="nickname">D*Z力</view>
							</view>
							<view class="bought-info">06-15 00:15:15购买1件</view>
						</view>
					</swiper-item>
					<swiper-item class="swiper-bought">
						<view class="bought-content">
							<view class="avator">
								<image class="avator-image" src="/static/title.png"></image>
								<view class="nickname">华hua</view>
							</view>
							<view class="bought-info">一小时前购买一件</view>
						</view>
						<view class="bought-content">
							<view class="avator">
								<image class="avator-image" src="/static/title.png"></image>
								<view class="nickname">D*Z力</view>
							</view>
							<view class="bought-info">06-15 00:15:15购买1件</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<rich-text class="goods-introduce" v-if="goodsInfo.goods_introduce"
				:nodes="imgIntroduce(goodsInfo.goods_introduce)"></rich-text>
		</scroll-view>
		<uni-goods-nav :style="'top:'+goodsNavTop+'px;height:180rpx'" class="goods-navs" :options="options"
			:button-group="customButtonGroup" @click="onClick" @buttonClick="buttonClick" />
	</view>
</template>

<script>
	import {
		getGoodsDetailList
	} from "@/api/api";
	import {
		unifyRequest
	} from '@/composables/unify-request'
	import {
		removeImgGap,
		splitToArr,
		formatPrice,
		formatPriceNoMark,
		getSystemHeight
	} from "@/utils/common"
	
	// 使用pinia：建议属性使用storeToRefs()解构，方法直接结构
	import { storeToRefs, mapStores,mapActions,mapState,mapGetters } from 'pinia';
	import {useCartStore} from '@/store/pinia/cart';
	
	export default {
		data() {
			return {
				query: {},
				goodsInfo: [],
				options: [{
					icon: 'shop',
					text: '首页'
				}, {
					icon: 'cart',
					text: '购物袋',
					info: 0,
					infoBackgroundColor: '#bc2840',
					// infoColor: "white"
				}, {
					icon: 'headphones',
					text: '客服',
					info: 2,
					infoBackgroundColor: '#bc2840',
				}],
				customButtonGroup: [{
						text: '加入购物袋',
						backgroundColor: '#333333',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#bc2840',
						color: '#fff'
					}
				]
			};
		},
		computed: {
			// 注意，我们不是在传递一个数组，而是一个接一个的 store。
			// 可以 id+'Store' 的形式访问每个 store 。
			 // ...mapStores(useCartStore),
			 // ...mapState(useCartStore,['goodsCount']),
			...mapGetters(useCartStore,['goodsCount']),
			goodsNavTop() {
				return getSystemHeight() - 90;
			},
			getPrice() {
				return formatPrice;
			},
			getPriceNoMark() {
				return formatPriceNoMark;
			},
			goodsFeature() {
				return splitToArr;
			},
			imgIntroduce() {
				return removeImgGap;
			}
		},
		onLoad(options) {
			this.query = options;
			this.getGoodsDetail();
			this.options[1].info = this.goodsCount;
		},
		methods: {
			// mapActions要用在methods里面
			...mapActions(useCartStore, ['addGoodsInfo']),
			async getGoodsDetail() {
				const {
					list
				} = await unifyRequest(getGoodsDetailList, {
					goods_id: this.query.goods_id
				});
				this.goodsInfo = list;
			},
			onClick(e) {
				if(e.content.text === "首页"){
					uni.switchTab({
						url:'/pages/home/home'
					})
				}else if(e.content.text === "购物袋"){
					uni.switchTab({
						url:'/pages/cart/cart'
					})
				}else if(e.content.text === "客服"){
					console.log("链接客服");
				}else{
					console.log("没有其他的了");
				}
			},
			buttonClick(e) {
				// 加入购物袋（需要将商品信息存入状态管理库）
				if(e.index === 0){
					this.addGoodsInfo(this.goodsInfo);
					this.options[1].info = this.goodsCount;
				// 立即购买
				}else{
					
				}
			}
		}
	}
</script>

<style lang="scss">
	.goods-detail-box {
		background-color: #f5f3f4;

		.swiper-box {
			height: 55%;
			width: 750rpx;
			background-color: #ffffff;

			.swiper-list {
				width: 100%;
				height: 100%;

				.swiper-view {
					width: 100%;
					height: 100%;

					.swiper-image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.swiper-pageNum {
				position: fixed;
				top: 92%;
				right: 6%;
				z-index: 1;
				width: 40px;
				height: 20px;
				line-height: 20px;
				text-align: center;
				border-radius: 20px;
				font-size: 13px;
				color: white;
				background-color: rgba(166, 158, 166, 0.4);

			}
		}

		.price-box {
			width: 100%;
			height: 100rpx;
			background-color: #fa3141;
			line-height: 100rpx;
			color: white;
			display: flex;
			justify-content: space-around;

			.price-left {
				display: flex;
				width: 60%;

				.xianshigou-icon {
					width: 36%;

					.bjs-xianshigou {
						display: flex;
						justify-content: center;
					}
				}

				.price-symbol,
				.old-price {
					font-size: 13px;
					height: 110rpx;
					line-height: 110rpx;
				}

				.price {
					font-size: 21px;
				}

				.old-price {
					text-decoration-line: line-through;
				}
			}

			.price-right {
				width: 40%;
				display: flex;
				flex-wrap: nowrap;

				.countdown-text {
					font-size: 13px;
				}

				.uni-countdown {
					height: 100rpx;
					line-height: 100rpx;
					margin-left: 2px;

					.uni-countdown__number,
					.uni-countdown__splitor {
						font-size: 13px;
					}

					.uni-countdown__number {
						color: #bc2840;
					}
				}
			}
		}

		.goods-desc {
			background-color: #ffffff;
			height: 160rpx;
			padding: 14px;
			display: flex;

			.goods-name {
				width: 80%;

				.goods-title {
					font-size: 17px;
					height: 50px;
					line-height: 25px;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.goods-feature {
					margin-top: 10px;
					font-size: 14px;
					display: flex;

					.goods-feature-item {
						margin-right: 10px;
						color: #616161;
					}
				}

			}

			.goods-share {
				width: 20%;
				display: flex;
				flex-direction: column;
				align-items: flex-start;

				.share-icon,
				.share-text {
					width: 100%;
					display: flex;
					justify-content: flex-end;
				}

				.share-text {
					font-size: 14px;
					color: #616161;
				}
			}
		}

		.goods-attr {
			width: 100%;
			height: 700rpx;

			.goods-logo {
				width: 100%;
				height: 40%;
				padding: 10px 0;
				border-radius: 10px;

				.goods-logo-image {
					width: 100%;
					height: 100%;
					border-radius: 10px;
				}

			}

			.goods-attr-box {
				width: 100%;
				background-color: #ffffff;
				padding: 10px 0;

				.sell,
				.freight,
				.service,
				.brand {
					height: 40px;
					line-height: 40px;
					display: flex;
					margin: 0 20px;

					:nth-child(1) {
						width: 20%;
						font-weight: bold;
					}

					:nth-child(2) {
						width: 80%;
					}
				}
			}

		}

		.bought-box {
			padding: 10px 0;
			background-color: #ffffff;

			.bought-title {
				margin: 0 20px;
				display: flex;
				justify-content: space-between;

				.title {
					font-weight: bold;
				}

				.view {
					color: #7c7c7c;
				}
			}

			.bought-list {
				margin: 10px 20px;
				height: 180rpx;

				.swiper-bought {
					height: 50%;

					.bought-content {
						height: 50%;
						line-height: 50%;
						display: flex;
						justify-content: space-between;
						font-size: 15px;

						.avator {
							width: 40%;
							height: 100%;
							line-height: 100%;
							display: flex;
							align-items: center;

							.avator-image {
								width: 20%;
								height: 50%;
								line-height: 100%;
								margin-right: 10px;
							}

							.nickname {}
						}

						.bought-info {
							height: 100%;
							line-height: 100%;
							display: flex;
							align-items: center;
							color: #7c7c7c;
						}
					}
				}
			}
		}

		.goods-introduce {
			height: fit-content;
		}

	}

	.goods-navs {
		height: 180rpx;
		width: 750rpx;
		// 设置吸顶或者吸底效果，设置position为fixed而不是absolute
		position: fixed;
		z-index: 999;
		background-color: #e5e5e0;
		border-top: 1px solid #dddbd1;

		.uni-tab__cart-box {
			height: 120rpx;
		}
	}
</style>