<template>
	<view class="button-box">
		<van-button class="add-button" type="primary" round color="#bc2840" size="large" @click="addAddress">添加新地址</van-button>
	</view>

</template>

<script>
	export default {
		name: "bjs-button",
		methods: {
			addAddress() {
				uni.navigateTo({
					url: '/packageAddress/address/address-add'
				})
			}
		}
	}
</script>

<style lang="scss">
	$whiteBgColor: #FFFFFF;

	.button-box {
		height: 180rpx;
		width: 90%;
		position: fixed;
		bottom: 0;
		padding: 16px 20px 0 20px;
		background-color: $whiteBgColor;
	}
</style>