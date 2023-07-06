<template>
	<view v-if="goods" @click="gotoGoodsDetail">
		<view class="goods-logo">
			<image class="logo"
				:src="goods.goods_big_logo === '' ? '../../static/goods-icons/no-goods.png' : goods.goods_big_logo"
				mode="scaleToFill"></image>
		</view>
		<view class="goods-desc">
			<view class="goods-name">{{goods.goods_name}}</view>
			<view class="goods-tips">夜光模式</view>
			<view class="goods-activity-box">
				<view class="goods-activity">满199元赠4件</view>
				<view class="goods-activity">积分抵现</view>
			</view>
			<view class="price-box">
				<view class="price">
					<bjs-price :price="goods.goods_price * 0.8"></bjs-price>
					<view class="old-price">{{getPrice(goods.goods_price)}}</view>
				</view>
				<view class="buy">
					<template v-slot:shop>
						<uni-icons class="buy-icon" custom-prefix="bjsicons" type="bjs-shopping-bag"
							size="34"></uni-icons>
					</template>
					<text class="buy-people">2189人购买</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		formatPrice,
		formatPriceNoMark
	} from "@/utils/common"

	export default {
		name: "bjs-goods",
		props: {
			goods: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {

			};
		},
		computed: {
			getPrice() {
				return formatPrice;
			},
		},
		onLoad() {
			console.log(this.goods);
		},
		methods:{
			
			gotoGoodsDetail(){
				uni.navigateTo({
					url:'/packageGoods/goods-detail/goods-detail?goods_id='+this.goods.goods_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.goods-tips {
		color: #666668;
		font-size: 13px;
		height: 24px;
		line-height: 24px;
	}

	.goods-logo {
		width: 160px;
		height: 160px;

		.logo {
			border-radius: 8px;
			width: 100%;
			height: 100%;
		}
	}

	.goods-desc {
		padding: 8px;

		.goods-name {
			height: 22px;
			line-height: 24px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.goods-activity-box {
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;

			.goods-activity {
				margin-right: 2px;
				width: fit-content;
				font-size: 13px;
				color: #bf2944;
				border: 1px solid #bf2944;
				border-radius: 5px;
				line-height: 18px;
				height: 18px;
				padding: 0 2px;
			}
		}

		.price-box {
			height: 50px;
			display: flex;

			.price {
				width: 50%;

				.old-price {
					// 继承的goods-tips类在html中也必须有
					@extend .goods-tips;
					// 给价格划中线
					text-decoration: line-through;
				}
			}

			.buy {
				width: 50%;
				display: flex;
				flex-direction: column;
				align-items: flex-end;

				.buy-icon {
					height: 70%;
					line-height: 40px;
				}

				.buy-people {
					@extend .goods-tips;
				}
			}
		}
	}
</style>