<template>
	<view>
		<view class="settle-box" v-if="!isEdit">
			<view class="check-all" v-if="hasRadio">
				<label class="radio" @click="changeAllCheck">
					<radio class="radio" :value="allChecked" :checked="allChecked" color="#bc2840"
						style="transform:scale(0.9)" />
				</label>
				全选
			</view>
			<view class="total" v-if="!hasRadio">
				共{{total}}件
			</view>
			<view class="total-price">
				<slot name="freight"></slot>
				<view class="final-price-box">
					<view class="final-price">
						<view class="count-text">合计:</view>
						<bjs-price :price="totalPrice || 0"></bjs-price>
					</view>
					<slot name="discountPrice"></slot>
				</view>
			</view>
			<view class="settle" @click="settle">{{btnName}}</view>
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
</template>

<script>
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
	export default {
		name: "bjs-settle",
		props: {
			isEdit: {
				type: Boolean,
				default: false
			},
			btnName: {
				type: String,
				default: '立即支付'
			},
			hasRadio: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			...mapState(useUserStore, ['token']),
			...mapState(useCartStore, ['total', 'totalPrice', 'allChecked']),
		},
		methods: {
			...mapActions(useCartStore, ['changeAllCheck', 'getTotal', 'getTotalPrice',
				'ifAllCheck', 'deleteCartGoods',
			]),
			deleteGoods() {
				this.deleteCartGoods();
			},
			// 结算
			settle() {
				// 先判断是否登录，已登录要判断是否有收获地址，都满足则跳转结算页
				if (this.total === 0) return this.$showMsg("请选择商品");

				if (this.token === '') return this.$showMsg("请先登录");
				
				// 注意this.$emit需要用成uni.$emit()
				// 正常来说单页面使用uni.$emit和uni.$on是没有问题的。但是如果是页面跳转之后使用的话是无法生效的。
				if(this.btnName === '立即支付')
				 uni.$emit('gotopay')
				
				else uni.navigateTo({
					url: '/packageSettle/settle/settle'
				})
			},
		}
	}
</script>

<style lang="scss">
	$grayText: #999999;
	$grayFontsize: 15px;
	$redColor: #bc2840;
	$whiteBgColor: #FFFFFF;

	.displayCenter {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.settle-box {
		height: 110rpx;
		width: 100%;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: $whiteBgColor;

		.check-all {
			height: 100%;
			width: 25%;
			@extend .displayCenter;
		}

		.total {
			height: 100%;
			width: 25%;
			color: $grayText;
			font-size: 16px;
			@extend .displayCenter;
		}

		.total-price {
			height: 100%;
			width: 50%;
			@extend .displayCenter;

			.final-price-box {
				font-size: 13px;

				.final-price {
					display: flex;

					.count-text {
						font-size: 16px;
					}
				}

				// .discount-price {
				// 	margin-left: 5px;
				// 	font-size: 13px;
				// 	color: $redColor;
				// }
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
</style>