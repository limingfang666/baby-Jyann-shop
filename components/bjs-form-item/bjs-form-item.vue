<template>
	<view class="form-item" v-for="(item,index) in formItems" :key="index"
		:style="index!== 3? 'border-bottom: 1px solid #f4f4f4':''">
		<slot name="radio" v-if="formItems.length==1"></slot>
		<view class="label" :style="'width:'+labelWidth">
			{{item.label}}
		</view>
		<!-- 使用v-model就可以实现数据双向绑定 -->
		<input v-if="index!==2" v-model="address[Object.keys(this.address)[index]]" type="text" class="placeholder"
			:placeholder="item.placeholder"
			:style="'width:'+phWidth+'; color:'+phColor+'; justify-content:'+phDisplay" />
		<view :style="'width:'+phWidth" v-if="index===2">
			<slot name="data-picker" :area="address.area"></slot>
		</view>
	</view>

	<view class="form-item" v-if="setItems.length===1">
		<slot name="radio"></slot>
		<view class="label" :style="'width:'+labelWidth">
			{{setItems[0].label}}
		</view>
		<!-- 使用v-model就可以实现数据双向绑定 -->
		<view class="placeholder" @click="exportWXAddress"
			:style="'width:'+phWidth+'; color:'+phColor+'; justify-content:'+phDisplay">
			<slot name="icon"></slot>
			{{setItems[0].placeholder}}
			<slot name="more"></slot>
		</view>
	</view>

</template>

<script>
	export default {
		name: "bjs-form-item",
		props: {
			labelWidth: {
				type: String,
				default: '30%'
			},
			phWidth: {
				type: String,
				default: '70%'
			},
			phColor: {
				type: String,
				default: '#808080'
			},
			phDisplay: {
				type: String,
				default: 'flex-start'
			},
			formItems: {
				type: Array,
				default: []
			},
			setItems: {
				type: Array,
				default: []
			},
			layout: {
				type: Object,
				default: {}
			},
			address: {
				type: Object,
				default: {}
			}
		},
		methods: {
			exportWXAddress() {
				const _This = this;
				uni.chooseAddress({
					success(res) {
						_This.address.name = res.userName;
						_This.address.tel = res.telNumber;
						_This.address.area = res.provinceName + res.cityName + res.countyName;
						_This.address.detailInfo = res.detailInfo;
					},
					fail(err) {
						uni.showToast({
							title: "调用微信地址失败",
							icon: "fail"
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.form-item {
		height: 50px;
		line-height: 50px;
		display: flex;
		font-size: 16px;
		padding: 0 10px;

		.placeholder {
			height: 100%;
			font-size: 16px;
			display: flex;
		}

		.data-picker {
			width: 70%;
		}

	}
</style>