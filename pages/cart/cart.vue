<template catchtouchmove="return">
	<view class="cart-edit" v-if="!isEdit" @click="clickEdit">
		编辑
	</view>
	<view class="cart-edit" v-if="isEdit" @click="clickEdit">
		完成
	</view>

	<scroll-view :scroll-y="true" :style="'height:'+contentHeight+'px'" :enable-back-to-top="true">
		<!-- 有商品展示 -->
		<view class="cart-box" v-if="goodsList.length>0">
			<uni-swipe-action class="goods-list" v-for="item in goodsList" :key="item.goods_id">
				<uni-swipe-action-item class="swipe-goods-item" :right-options="options"
					@click="sliderClick($event, item.goods_id)">
					<view class="goods-display">
						<view class="radio">
							<radio class="radio" @click="clickCurRadio(item.goods_id,item.checked)"
								:value="item.goods_id" :checked="item.checked?true:false" color="#bc2840"
								style="transform:scale(0.9)" />
						</view>
						<bjs-settle-goods class="bjs-goods" :goods="item">
							<template v-slot:cart>
								<view class="goods-promo">限时购</view>
								<view class="goods-price-desc">
									优惠已降价￥38
								</view>
								<view class="goods-price">
									<bjs-price :price="item.goods_price"></bjs-price>
									<uni-number-box class="number-box" v-model="item.cart_counts"
										@change="changeQuality($event,item)" />
								</view>
							</template>
						</bjs-settle-goods>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		<!-- 无商品 -->
		<view class="no-goods-box" v-if="goodsList.length===0">
			<view class="no-goods">
				<template v-slot:shop>
					<uni-icons class="no-goods-icon" custom-prefix="bjsicons" type="bjs-no-goods"
						size="100"></uni-icons>
				</template>
				<view class="no-goods-text">
					购物袋空空如也
				</view>
				<view class="no-goods-mark">
					新品上线，火爆售卖中
				</view>
			</view>
		</view>
		<!-- 推荐商品列表 -->
		<view class="split-line">
			<view class="line-left"></view>
			<template v-slot:shop>
				<uni-icons custom-prefix="bjsicons" type="bjs-red-heart" size="18"></uni-icons>
			</template>
			<view class="line-right"></view>
		</view>
		<bjs-goods-list class="recommond-list" :goodsList="recommendGoodsList"></bjs-goods-list>
	</scroll-view>
	<!-- 结算区 -->
	<bjs-settle :isEdit="isEdit" :btnName="'结算'">

		<template v-slot:freight>
			<view class="freight">不含运费</view>
		</template>
		<template v-slot:discountPrice>
			<view class="discount-price">
				商品优惠 ￥102.00
			</view>
		</template>
	</bjs-settle>
</template>

<script>
	import {
		setTabBarInfo
	} from "@/composables/tabBar-logoInfo"
	import {
		useCartStore
	} from "@/store/pinia/cart"
	import {
		useUserStore
	} from "@/store/pinia/user"
	import {
		mapState,
		mapGetters,
		mapActions
	} from 'pinia'
	import {
		getSystemHeight
	} from "@/utils/common"
	import {
		getGoodsList
	} from "@/api/api"
	import {
		unifyRequest
	} from '@/composables/unify-request'

	export default {
		data() {
			return {
				isEdit: false,
				recommendGoodsList: [],
				params: {
					query: '',
					cid: '',
					pagenum: 1,
					pagesize: 20
				},
				// 滑动按钮
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#bc2840'
					}
				}]
			};
		},
		computed: {
			...mapState(useCartStore, ['total', 'totalPrice', 'goodsList', 'allChecked']),
			...mapState(useUserStore, ['token']),
			...mapGetters(useCartStore, ['goodsQuality']),
			contentHeight() {
				// -编辑区50 -结算区55
				return getSystemHeight() - 105;
			}
		},
		onLoad() {
			// 给tabBar页面设置徽标
			setTabBarInfo();

			// 如果没有token直接不显示购物袋页面，直接跳转登录页
			if (this.token === '') {
				return uni.navigateTo({
					url: '/packageUser/login/login'
				})
			}

			// 发起请求获取推荐商品列表
			this.getRecommondGoods();
		},
		methods: {
			...mapActions(useCartStore, ['getTotal', 'getTotalPrice',
				'updateGoodsList', 'getAllChecked', 'ifAllCheck', 'getAllNotChecked', 'deleteCartGoods',
				'sliderDeleteGoods'
			]),
			clickCurRadio(goods_id, checked) {
				// 动态改变数组checked
				this.goodsList.map(item => {
					if (item.goods_id === goods_id) item['checked'] = item['checked'] ? false : true;
					return item;
				});

				this.ifAllCheck();
			},
			changeQuality(e, item) {
				// 更改total,totalPrice,cart_counts
				this.updateGoodsList(e, item);
			},
			clickEdit() {
				this.isEdit = !this.isEdit;
			},
			async getRecommondGoods() {
				// cid=28&query=海尔
				this.params.cid = 28;
				this.params.query = '海尔';

				const {
					list
				} = await unifyRequest(getGoodsList, this.params);
				this.recommendGoodsList = list.goods;
			},
			sliderClick(e, goods_id) {
				console.log("ss");
				this.sliderDeleteGoods(goods_id);
			},
		},
	}
</script>

<style lang="scss">
	$grayText: #999999;
	$grayFontsize: 15px;
	$grayBgColor: #f4f4f4;
	$redColor: #bc2840;
	$whiteBgColor: #FFFFFF;

	.displayCenter {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.cart-edit {
		height: 100rpx;
		line-height: 100rpx;
		display: flex;
		flex-direction: row-reverse;
		padding-right: 10px;
		font-size: 15px;
	}

	.cart-box {
		background-color: #f5f3f4;
		padding: 10px 10px;

		.goods-list {
			padding: 10px 10px;
			background-color: $whiteBgColor;
			display: flex;
			border-radius: 6px;
			flex-direction: column;

			.swipe-goods-item {
				// 父级goods-list 宽度和滑块宽度不一致，导致右侧1px间隙
				padding-right: 5px;
				display: flex;
			}

			.goods-display {
				height: 100%;
				display: flex;


				.radio {
					width: 8%;
					height: 100%;
					@extend .displayCenter;
				}

				.bjs-goods {
					width: 92%;
					display: flex;
				}

				.goods-promo {
					margin: 5px 0;
					width: fit-content;
					border: 1px solid $redColor;
					padding: 5px;
					border-radius: 5px;
					font-size: 15px;
					color: $redColor;
				}

				.goods-price {
					margin: 5px 0;
					display: flex;
					justify-content: space-between;

					.number-box {
						margin-left: 10px;
					}
				}
			}
		}
	}

	.no-goods-box {
		background-color: $grayBgColor;
		width: 100%;
		padding-top: 10px;

		.no-goods {
			padding: 10px 0;
			height: 35%;
			width: 100%;
			background-color: $whiteBgColor;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		.no-goods-icon {
			padding: 20px 0;
		}

		.no-goods-text,
		.no-goods-mark {
			padding: 5px;
		}

		.no-goods-mark {
			color: $grayText;
			font-size: $grayFontsize;
		}
	}

	.split-line {
		width: 100%;
		height: 50px;
		display: flex;
		align-items: center;
		background-color: $grayBgColor;

		.line-left,
		.line-right {
			margin: 16px 16px 8px 16px;
			width: 60%;
			height: 1px;
			border-top: 1px solid $grayText;
			@extend .displayCenter;
		}
	}

	// 结算区插槽
	.freight {
		@extend .displayCenter;
		color: $grayText;
		font-size: $grayFontsize;
	}

	.discount-price {
		margin-left: 5px;
		font-size: 13px;
		color: $redColor;
	}
</style>