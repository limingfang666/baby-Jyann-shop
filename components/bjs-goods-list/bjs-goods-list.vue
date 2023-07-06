<template>
	<view class="goods-list">
		<bjs-goods class="goods" :goods="goods" v-for="goods in goodsList" :key="goods.goods_id"></bjs-goods>
		<view class="goods-list-bottom" v-if="isBottom">
			<template v-slot:shop>
				<uni-icons class="bottom-icons" custom-prefix="bjsicons" type="bjs-kids" size="40"></uni-icons>
			</template>
			<text class="bottom-text">已经到底啦~</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"bjs-goods-list",
		props:{
			goodsList:{
				type: Array,
				default: []
			},
			isBottom:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
			};
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
		.goods-list {
			background-color: #f1f1f1;
			width: 100%;
			height: fit-content;
			//justify-content默认flex-start左对齐，子元素只设置margin top left就能上下左右margin值相同
			display: flex;
			flex-wrap: wrap;

			.goods {
				width: 46%;
				height: 300px;
				// 只设置margin top left,
				margin: 10px 0 0 10px;
				background-color: #ffffff;
				border-radius: 8px;
			}

			.goods-list-bottom {
				display: flex;
				flex-direction: column;
				justify-content: center;
				width: 100%;
				height: 60px;
				padding-bottom: 10px;

				.bottom-icons {
					display: flex;
					justify-content: center
				}

				.bottom-text {
					@extend .goods-tips;
					font-size: 14px;
					text-align: center;
				}
			}
		}
</style>