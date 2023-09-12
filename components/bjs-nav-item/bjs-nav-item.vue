<template>
	<view class="nav-content" v-if="!isIcon">
		{{content}}
	</view>
	<template v-slot:up v-if="isIcon">
		<uni-icons custom-prefix="bjsicons" :type="iconType" :size="size"></uni-icons>
	</template>
	<view class="title" :style="'font-size:'+fontSize">{{title}}</view>
</template>

<script>
	export default {
		name: "bjs-nav-item",
		props:{
			isIcon:{
				type: Boolean,
				default: true
			},
			title:{
				type: String,
				default:'我的使用'
			},
			iconType:{
				type: String,
				default:'bjs-on-trial'
			},
			size:{
				type: Number,
				default: 30
			},
			fontSize:{
				type: String,
				default: '15px'
			},
			content:{
				type: String,
				default: '0'
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	$grayText: #6f6f6f;
	
	.title{
		margin-top: 8px;
		color: $grayText;
	}
	
	.nav-content{
		font-weight: bold;
		font-size: 18px;
	}
</style>