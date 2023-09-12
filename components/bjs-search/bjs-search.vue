<template>
	<view class="bjs-search-box" :style="'top:'+top+';width:' + width +'; height:'+ height +';line-height:'+ height +'; background-color:'+bgColor + ';border-radius:'+radius" @click="search">
		<view class="icon-box" v-if="hasIcon">
			<!-- 是否自定义icon图标 -->
			<icon v-if="!customIcon" class="icon-content" type="search" size="19" color="iconColor"></icon>
			<template v-if="customIcon" v-slot:searchIcon>
				<uni-icons custom-prefix="bjsicons" :type="iconType" size="30" color="iconColor" @click="search"></uni-icons>
			</template>
		</view>
		<!-- 文字纵向滚动 -->
		<swiper v-if="searchHistory.length>0" class="swiper-container" circular :vertical="true" :autoplay="true" :interval="4000" :duration="500">
			<swiper-item v-for="(item,index) in searchHistory" :key="index">
				<view class="swiper-item">{{searchHistory[index]}}</view>
			</swiper-item>
		</swiper>
		<text :style="'color:'+placeholderColor" class="placeholder" v-if="placeholder">{{placeholder}}</text>
		<slot name="button"></slot>
	</view>
	<slot name="down-button"></slot>
</template>

<script>
	export default {
		name: "bjs-search",
		props: {
			// 整个组件宽，高，背景色，轮播数据都可以从父组件传；iconSize也可传递
			searchHistory: {
				type: Array,
				default: []
			},
			placeholder:{
				type: String,
				default: ''
			},
			width: {
				type: String,
				default: '680rpx'
			},
			height:{
				type: String,
				default: '70rpx'
			},
			bgColor: {
				type: String,
				default: 'rgba(238, 238, 238, 0.3)'
			},
			placeholderColor: {
				type: String,
				default: '#FFF'
			},
			top: {
				type: String,
				default: '150rpx'
			},
			radius:{
				type: String,
				default: '40rpx'
			},
			iconColor:{
				type:String,
				default: 'white'
			},
			customIcon:{
				type: Boolean,
				default: false
			},
			hasIcon:{
				type: Boolean,
				default: true
			},
			iconType:{
				type: String,
				default: 'bjs-search'
			},
			cancel:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		},
		methods:{
			search(){
				this.$emit('search');
			}
		}
	}
</script>

<style lang="scss">
	.bjs-search-box {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.icon-box {
			margin: 0 20rpx;
			width: 20px;
			
			.icon-content{
				height: 70rpx;
				line-height: 70rpx;
				display: flex;
				align-items: center;
			}
		}

		.swiper-container {
			width: 100px; 
			height: 40px;
			margin: 0 5px;
			color: white;
			font-size: 34rpx;
			font-family: sans-serif;
		}
		
		.placeholder{
			height: 40px;
			line-height: 40px;
			font-size: 16px;
			color: #FFFFFF;
		}
		.cancel{
			margin-right: 10px;
		}
	}
</style>