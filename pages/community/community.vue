<template>
	<view>
		<uni-swipe-action>
			<uni-swipe-action-item :left-options="options2" :right-options="options1" @click="bindClick">
				<view class="content-box"><text>使用数据填充</text></view>
			</uni-swipe-action-item>
		</uni-swipe-action>
		
		<uni-swipe-action>
					<uni-swipe-action-item
					    :left-options="options2"
					    :threshold="0"
					    :right-options="options1"
					    @click="bindClick"
					>
						<view class="content-box" @click="contentClick">
							<text class="content-text">使用数据填充</text>
						</view>
					</uni-swipe-action-item>
			</uni-swipe-action>	
	</view>
</template>

<script>
	import {
		setTabBarInfo
	} from "@/composables/tabBar-logoInfo"

	export default {
		data() {
			return {
				options1: [{
					text: '取消置顶'
				}],
				options2: [{
						text: '取消',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '确认',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]
			};
		},
		onLoad() {
			// 给tabBar页面设置徽标
			setTabBarInfo();
		},
		methods: {
			bindClick(e) {
				console.log(e);
				uni.showToast({
					title: `点击了${e.position === 'left' ? '左侧' : '右侧'} ${e.content.text}按钮`,
					icon: 'none'
				});
			},
			contentClick(){
				console.log("0000000000");
			}
		}
	}
</script>

<style lang="scss">
.content-box {
    flex: 1;
    height: 44px;
    line-height: 44px;
    padding: 0 15px;
    position: relative;
    background-color: #fff;
    border: 1px solid #f5f5f5;
}
</style>