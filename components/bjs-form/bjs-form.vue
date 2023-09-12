<template>
	<form class="form-box" @submit="formSubmit" @reset="formReset">
		<!-- 收货信息 -->
		<view class="bjs-form-item-box">
			<bjs-form-item class="bjs-form-item" phWidth="70%" :formItems="formItems" :address="address">
				<!-- 省市区级联选择器 -->
				<template #data-picker="{area,width}">
					<uni-data-picker class="data-picker" :localdata="cityData" v-model="address.area"
						v-slot:default="{data, error, options}" popup-title="所在地区" placeholder="选择市">
						<view v-if="error" class="error">
							<text>{{error}}</text>
						</view>
						<view v-else-if="data.length" class="selected">
							<view v-for="(item,index) in data" :key="index" class="selected-item">
								<text>{{item.text}}</text>
							</view>
						</view>
						<view v-else class="active-region">
							<block v-if="area!='请选择'">{{area}}</block>
							<block v-else>
								<text>请选择</text>
								<uni-icons type="forward"></uni-icons>
							</block>

						</view>
					</uni-data-picker>
				</template>
			</bjs-form-item>
		</view>
		<!-- 设置为默认地址 -->
		<view class="bjs-form-item-box">
			<bjs-form-item class="bjs-form-item" :address="address" :setItems="setItems" labelWidth="40%"
				phDisplay="flex-end" phWidth="60%" phColor="#70d88d">
				<template v-slot:radio v-if="setItems[0]">
					<label class="radio">
						<radio :value="setItems[0].default" :checked="setItems[0].default" @click="changeRadio"
							style="transform:scale(0.8)" />
					</label>
				</template>
				<template v-slot:icon>
					<uni-icons custom-prefix="bjsicons" type="bjs-wechat-icon" size="20" color="#70d88d"></uni-icons>
				</template>
				<template v-slot:more>
					<uni-icons type="forward"></uni-icons>
				</template>
			</bjs-form-item>
		</view>
		<!-- 按钮必须在表单form里面 -->
		<view class="uni-btn-v">
			<!-- 加上type="default"则必须使用button[type=default]修改其样式，但是小程序中不能使用这种形式 -->
			<button class="submit-button" form-type="submit">保存</button>
		</view>
	</form>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapActions
	} from 'pinia'
	import {
		useAddressStore
	} from "@/store/pinia/address"
	import cityData from "@/data/city-china.json";

	export default {
		name: "bjs-form",
		props: {
			setItems: {
				type: Array,
				default: []
			},
			formItems: {
				type: Array,
				default: []
			},
			address: {
				type: Object,
				default: {}
			},
		},
		computed: {
			...mapState(useAddressStore, ['addressList']),
		},
		data() {
			return {
				cityData,
			}
		},
		methods: {
			...mapActions(useAddressStore,['addAddress']),
			changeRadio() {
				this.setItems[0].default = !this.setItems[0].default;
				this.address.default = this.setItems[0].default;
			},
			formSubmit: function(e) {
				if (this.address.name === '' || this.address.tel === '' ||
					this.address.area === '' || this.address.detailInfo === '') {
					return uni.showToast({
						title: "请输入完整地址信息",
						icon: "none"
					})
				}
				// 保存地址到store
				console.log(this.address);
				this.addAddress(this.address);
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss">
	$fontColor2: #808080;
	$whiteBgColor: #FFFFFF;

	.form-box {
		height: fit-content;

		.bjs-form-item-box {
			margin-bottom: 10px;
			border-radius: 6px;
			background-color: $whiteBgColor;
			padding: 0 10px;
		}
	}

	// 这种方式小程序会报警告Some selectors are not allowed in component wxss, including tag name selectors, ID selectors, and attribute selectors.
	// button[type=default] {
	.submit-button {
		color: #fff;
		background-color: #bc2840;
		border-radius: 20px;
	}

	.data-picker {
		//data-picker必须和父级元素长度一直才能占满整个容器
		width: 70%;

		.selected {
			// 修改选择完成后省市区横向显示（类名为uni-data-pickerview组件vue文件中定义）
			display: flex;
			font-size: 16px;

			// 修改选择完成后省市区间隔距离
			.selected-item {
				padding-right: 10px;
			}
		}

		.active-region {
			width: 100%;
			font-size: 16px;
			color: $fontColor2;
			display: flex;
			justify-content: space-between;
		}
	}
</style>