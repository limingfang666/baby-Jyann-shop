<template>
	<view style="height: 2000px;" class="cart-box">
		顶部
	</view>
	<button @click="backToTop">backToTop</button>
</template>

<script>
	export default {
		data() {
			return {
			};
		},
		methods: {
			backToTop(){
				uni.pageScrollTo({
					selector: ".cart-box",
					scrollTop: 0
				})
			}
		},
	}
</script>

<style lang="scss">

</style>