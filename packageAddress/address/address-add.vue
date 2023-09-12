<template>
	<view class="address-add-box" :style="'height:'+(contentHeight+90)+'px'">
		<!-- form表单只能绑定一个数据，两次调用也只能提交对应的一个表单 -->
		<bjs-form class="form-item" :form-items="formItems" :setItems="setItems" :address="address"></bjs-form>
	</view>
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
	import {
		getSystemHeight
	} from "@/utils/common"

	export default {
		computed: {
			...mapState(useAddressStore, ['addressList']),
			contentHeight() {
				return getSystemHeight();
			},
		},
		data() {
			return {
				address:{
					name: '',
					tel: '',
					area: '请选择',
					detailInfo: '',
					default: false
				},
				formItems: [{
						"label": '收货人',
						"placeholder": '请使用真实姓名',
						"value": '',
						"default": false
					},
					{
						"label": '手机号码',
						"placeholder": '收件人电话号码',
						"value": '',
						"default": false
					},
					{
						"label": '所在地区',
						"placeholder": '请选择',
						"value": '',
						"default": false
					},
					{
						"label": '详细地址',
						"placeholder": '请输入街道小区门牌登信息',
						"value": '',
						"default": false
					},
				],
				setItems: [{
					"label": '设置为默认地址',
					"placeholder": '导入微信地址',
					"value": '',
					"default": false
				}, ]
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	$grayBgColor: #f4f4f4;
	$fontColor: #9a9a9a;

	.address-add-box {
		padding: 10px;
		background-color: $grayBgColor;
	}
</style>