<template>
	<view class="now-price" :style="'color:'+color">
		<text class="price-mark">￥</text>{{getPriceNoMark(price)}}
	</view>
</template>

<script>
	import { formatPriceNoMark } from "@/utils/common"
		
	export default {
		name:"bjs-price",
		props:{
			price:{
				type: Number,
				default: 0
			},
			color:{
				type: String,
				default: '#bc2840'
			}
		},
		data() {
			return {
				
			};
		},
		computed:{
			getPriceNoMark() {
				return formatPriceNoMark;
			}
		}
	}
</script>

<style lang="scss">
$redColor: #bc2840;
.now-price {
	font-size: 20px;
	color: $redColor;

	.price-mark {
		font-size: 13px;
	}
}
</style>