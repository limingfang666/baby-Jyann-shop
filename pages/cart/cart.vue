<template>
	<view class="cart-edit" v-if="!isEdit" @click="clickEdit">
		编辑
	</view>
	<view class="cart-edit" v-if="isEdit" @click="clickEdit">
		完成
	</view>

	<scroll-view scroll-y="true" :style="'height:'+contentHeight+'px'">
		<!-- 有商品展示 -->
		<view class="cart-box" v-if="goodsList.length>0">
			<view class="goods-box">
				<view class="goods-list" v-for="item in goodsList" :key="item.goods_id">
					<uni-swipe-action>
						<uni-swipe-action-item :right-options="options" @click="sliderClick($event, item.goods_id)">
							<view class="goods-display">
								<view class="radio">
									<radio class="radio" @click="clickCurRadio(item.goods_id,item.checked)"
										:value="item.goods_id" :checked="item.checked?true:false" color="#bc2840"
										style="transform:scale(0.9)" />
								</view>
								<image class="goods-image" :src="item.goods_small_logo" mode=""></image>
								<view class="goods-info">
									<view class="goods-title">{{item.goods_name}}</view>
									<view class="goods-props">
										<view class="goods-props-cont">{{item.attrs[0].attr_vals}}</view>
										<uni-icons type="bottom"></uni-icons>
									</view>
									<view class="goods-promo">限时购</view>
									<view class="goods-price-desc">
										优惠已降价￥38
									</view>
									<view class="goods-price">
										<bjs-price :price="item.goods_price"></bjs-price>
										<uni-number-box v-model="item.cart_counts"
											@change="changeQuality($event,item)" />
									</view>
								</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
			</view>
			<view class="settle-box" v-if="!isEdit">
				<view class="check-all">
					<label class="radio" @click="changeAllCheck">
						<radio class="radio" :value="allChecked" :checked="allChecked" color="#bc2840"
							style="transform:scale(0.9)" />
					</label>
					全选
				</view>
				<view class="total-price">
					<view class="freight">不含运费</view>
					<view class="final-price-box">
						<view class="final-price">
							<view class="count-text">合计:</view>
							<bjs-price :price="totalPrice || 0"></bjs-price>
						</view>

						<view class="discount-price">
							商品优惠 ￥102.00
						</view>
					</view>
				</view>
				<view class="settle" @click="settle">结算（{{total || 0}}）</view>
			</view>
			<view class="settle-box" v-if="isEdit">
				<view class="check-all">
					<label class="radio" @click="changeAllCheck">
						<radio class="radio" :value="allChecked" :checked="allChecked" color="#bc2840"
							style="transform:scale(0.9)" />
					</label>
					全选
				</view>
				<view class="delete-btn" @click="deleteGoods">
					删除({{total}})
				</view>
			</view>
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

</template>

<script>
	import {
		setTabBarInfo
	} from "@/composables/tabBar-logoInfo"
	import {
		useCartStore
	} from "@/store/pinia/cart"
	import {
		getSystemHeight
	} from "@/utils/common"
	import {
		mapState,
		mapGetters,
		mapActions
	} from 'pinia'
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
				allNotCheck: false,
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
			...mapGetters(useCartStore, ['goodsQuality']),
			getQuality() {
				return this.getGoodsQuality(goods_id);
			},
			contentHeight() {
				// -编辑区50 -结算区55
				return getSystemHeight() - 105;
			}
		},
		onLoad() {
			// 给tabBar页面设置徽标
			setTabBarInfo();

			// 重置商品加购数量到数据中
			this.calculateGoods();

			// 发起请求获取推荐商品列表
			this.getRecommondGoods();
		},
		methods: {
			...mapActions(useCartStore, ['getGoodsQuality', 'getTotal', 'getTotalPrice',
				'updateGoodsList', 'getAllChecked', 'deleteCartGoods','sliderDeleteGoods'
			]),
			calculateGoods() {
				this.goodsList.map(item => {
					let count = this.getGoodsQuality(item.goods_id);
					item['cart_counts'] = count;
					return item;
				});
			},
			changeAllCheck() {
				this.allNotCheck = !this.allNotCheck;

				this.goodsList.map(item => {
					item.checked = !this.allChecked;
				})
				this.ifAllCheck();
			},
			clickCurRadio(goods_id, checked) {
				// 动态改变数组checked
				this.goodsList.map(item => {
					if (item.goods_id === goods_id) item['checked'] = item['checked'] ? false : true;
					return item;
				});

				this.ifAllCheck();
			},
			ifAllCheck() {
				this.getAllChecked();
				this.allNotCheck = this.goodsList.every(item => item.checked === false);

				this.getTotal();
				this.getTotalPrice();
			},
			changeQuality(e, item) {
				// 更改total,totalPrice,cart_counts
				this.updateGoodsList(e, item);
				this.getTotal();
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
			// 结算
			settle() {
				// 先判断是否登录，已登录要判断是否有收获地址，都满足则跳转结算页
				console.log("结算");
			},
			deleteGoods() {
				this.deleteCartGoods();
				// 删除后重新计算选中商品总数
				this.getTotal();
			},
			sliderClick(e,goods_id) {
				console.log(e,goods_id)
				this.sliderDeleteGoods(goods_id);
				this.getTotal();
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
		.goods-box {
			background-color: #f5f3f4;
			padding: 10px 10px;
			// 去除结算区高度
			width: 94%;

			.goods-list {
				height: 300rpx;
				padding: 10px 10px;
				background-color: $whiteBgColor;
				display: flex;
				border-radius: 6px;
				flex-direction: column;

				.goods-display {
					height: 100%;
					display: flex;

					.radio {
						width: 10%;
						height: 100%;
						@extend .displayCenter;
					}

					.goods-image {
						width: 25%;
						height: 80%;
						line-height: 100%;
						display: flex;
						align-items: center;
					}

					.goods-info {
						width: 60%;
						margin-left: 10px;

						.goods-title {
							height: 22px;
							line-height: 24px;
							@extend .ellipsis;
						}

						.goods-props {
							margin: 5px 0;
							width: fit-content;
							background-color: $grayBgColor;
							display: flex;

							.goods-props-cont {
								padding: 5px;
								max-width: 80%;
								background-color: $grayBgColor;
								color: $grayText;
								font-size: $grayFontsize;
								max-height: 19px;
								@extend .ellipsis;
							}
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
						}
					}

				}
			}
		}

		.settle-box {
			height: 110rpx;
			width: 100%;
			position: fixed;
			bottom: 0;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.check-all {
				height: 100%;
				width: 25%;
				@extend .displayCenter;
			}

			.total-price {
				height: 100%;
				width: 50%;
				@extend .displayCenter;

				.freight {
					color: $grayText;
					font-size: $grayFontsize;
				}

				.final-price-box {
					font-size: 13px;

					.final-price {
						display: flex;

						.count-text {
							font-size: 16px;
						}
					}

					.discount-price {
						margin-left: 5px;
						font-size: 13px;
						color: $redColor;
					}
				}
			}

			.settle {
				height: 100%;
				width: 25%;
				background-color: $redColor;
				color: $whiteBgColor;
				@extend .displayCenter;
			}

			.delete-btn {
				width: 90px;
				height: 50%;
				font-weight: bold;
				line-height: 50%;
				border: 1px solid $grayText;
				border-radius: 20px;
				@extend .displayCenter;
				color: $redColor;
				margin-right: 20px;
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
</style>