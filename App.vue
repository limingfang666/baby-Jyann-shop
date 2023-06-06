<script>
	export default {
		onLaunch: function() {
		},
		onShow: function() {
		},
		onHide: function() {
		}
	}
</script>

<style lang="scss">
	// 每个页面公共页面样式
	@import '@/uni_modules/uni-scss/index.scss';
	/* uni-app中的条件判断语句 */
	/* #ifdef APP-PLUS  || H5 */
	uni-swiper .uni-swiper-dot {
		width: 10rpx;
		height: 4rpx;
	}
	uni-swiper .uni-swiper-dot-active {
		width: 40rpx;
		border-radius: 6rpx;
	}
	/* #endif */
 
	/* #ifdef MP-WEIXIN */
	wx-swiper .wx-swiper-dot {
		width: 10rpx;
		height: 10rpx;
	}
 
	wx-swiper .wx-swiper-dot-active {
		width: 30rpx;
		height: 10rpx;
		border-radius: 6rpx;
	}
	/* #endif */
	
	
	/* #ifndef APP-NVUE */
	// nvue 页面暂时不支持自定义图标
	@import '@/static/icon-css/customicons.css';
	@import "@/static/icon-css/iconfont.css";
	// 设置整个项目的背景色
	// page {
	// 	background-color: #f5f5f5;
	// }
	
	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
	
	// 隐藏滚动条
	::-webkit-scrollbar{
	      display: none;
	}

	
</style>
