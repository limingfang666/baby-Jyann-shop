<template>
	<image class="goods-image" v-if="goods.goods_small_logo!==''" :src="goods.goods_small_logo"></image>
	<view v-if="goods.goods_small_logo===''">
		<template v-slot:shop>
			<uni-icons class="goods-image" custom-prefix="bjsicons" type="bjs-no-goods"
				size="76"></uni-icons>
		</template>
	</view>
	<view class="goods-info" :style="layout===false?'display:flex; justify-content:space-between':'display:flex; flex-direction:column'">
		<view class="goods-title">{{goods.goods_name}}</view>
		<view class="goods-props" v-if="goods.attrs[0].attr_vals">
			<view class="goods-props-cont">{{goods.attrs[0].attr_vals}}</view>
			<uni-icons type="bottom"></uni-icons>
		</view>
		<slot name="cart"></slot>
		<slot name="settle"></slot>
	</view>
</template>

<script>
	export default {
		name: "bjs-settle-goods",
		props: {
			goods: {
				type: Object,
				default: {}
			},
			layout:{
				type: Boolean,
				// 默认纵向布局
				default: true
			}
		},
		data() {
			return {

			};
		},
		onLoad() {
			console.log('onload.....');
		}
	}
</script>

<style lang="scss">
	$grayText: #999999;
	$grayFontsize: 15px;
	$grayBgColor: #f4f4f4;
	$redColor: #bc2840;
	
	.ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.goods-image {
		width: 34%;
		height: 100%;
		line-height: 100%;
		display: flex;
		align-items: center;
	}

	.goods-info {
		width: 66%;
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
</style>