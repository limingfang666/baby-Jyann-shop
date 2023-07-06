<template>
	<view>
		个人中心
	</view>
</template>

<script>
	import { setTabBarInfo } from "@/composables/tabBar-logoInfo"
	export default {
		data() {
			return {
				
			};
		},
		onLoad() {
			// 给tabBar页面设置徽标
			setTabBarInfo();
		}
	}
</script>

<style lang="scss">

</style>
