<template>
	<view class="settle-container" :style="'height:'+contentHeight+'px'">
		<view class="blank-consignee-info" v-if="addressList.length===0" @click="addAddress">
			<template v-slot:contact>
				<uni-icons custom-prefix="bjsicons" type="bjs-consignee-info" size="30"></uni-icons>
			</template>
			<view class="fill-in-consignee">
				请填写收货人信息
			</view>
			<uni-icons type="right" size="18"></uni-icons>
		</view>
		<view class="consignee-info" v-if="defaultAddress">
			<view class="basicTitle">
				收货人信息
			</view>
			<view class="address-info">
				<view class="contacts">
					{{defaultAddress.name}} {{defaultAddress.tel}}
				</view>
				<view class="address">
					<view class="detail-address">
						{{defaultAddress.area}}{{defaultAddress.detailInfo}}
					</view>
					<uni-icons type="right" size="18"></uni-icons>
				</view>
			</view>
		</view>
		<view class="goods-info-box">
			<view class="basicTitle">
				商品信息
			</view>
			<block v-for="goods in settleGoodsList" :key="goods.goods_id">
				<bjs-settle-goods v-if="goods" :layout="false" :goods="goods" class="bjs-goods">
					<template v-slot:settle>
						<bjs-price :color="'#000000'" :price="goods.goods_price"></bjs-price>

						<view class="">
							共{{goods.cart_counts}}件
						</view>
					</template>
				</bjs-settle-goods>
			</block>
		</view>
		<view class="order-box">
			<view class="order-info">
				<view class="order-info-list">
					<view class="">
						商品总额
					</view>
					<view>￥29</view>
				</view>
				<view class="order-info-list">
					<view class="">
						运费
					</view>
					<view>免运费</view>
				</view>
				<view class="order-info-list">
					<view class="">
						积分抵扣
					</view>
					<view>500积分可抵￥1</view>
				</view>
				<view class="order-info-list">
					<view class="">
						限时购
					</view>
					<view>-￥4</view>
				</view>
				<view class="order-info-list">
					<view class="">
						订单备注
					</view>
					<view>选填</view>
				</view>
				<view class="order-info-list">
					<view class="">
						店员邀请码
					</view>
					<view>选填</view>
				</view>
			</view>
			<view class="total-price">
				<view class="">
					实际支付金额
				</view>
				<bjs-price :price="total?total:0"></bjs-price>
			</view>
		</view>
	</view>
	<!-- 结算区 -->
	<bjs-settle :hasRadio="false" @gotopay="gotopay"></bjs-settle>
</template>

<script>
	import {
		getSystemHeight
	} from "@/utils/common"
	import {
		useCartStore
	} from "@/store/pinia/cart"
	import {
		useAddressStore
	} from "@/store/pinia/address"
	import {
		useOrderStore
	} from "@/store/pinia/order"
	import {
		mapState,
		mapGetters,
		mapActions
	} from 'pinia'
	
	import { createOrder, prepayOrder } from "@/api/api"
	import { unifyRequest } from "@/composables/unify-request"
	
	export default {
		data() {
			return {
				settleGoodsList: [],
				orderParams: {
					order_price: 0.1,
					consignee_addr: '',
					order_detail: "",
					// [{
					// 		goods_id:0,
					// 		goods_name:'',
					// 		goods_price:0,
					// 		goods_small_logo:'',
					// 		counts:0,
					// 		selectStatus:false
					// 	}
					// ],
					goods: [{
						goods_id: 0,
						goods_number: 0,
						goods_price: 0
					}]
				}
			};
		},
		computed: {
			...mapState(useOrderStore, ['orderList']),
			...mapState(useCartStore, ['total', 'totalPrice', 'goodsList']),
			...mapGetters(useAddressStore, ['defaultAddress']),
			...mapState(useAddressStore, ['addressList', 'defaultAddress']),
			contentHeight() {
				// 结算区55
				return getSystemHeight() - 55;
			}
		},
		methods: {
			...mapActions(useCartStore, ['getTotal', 'getTotalPrice']),
			...mapActions(useOrderStore, ['addOrder']),
			addAddress() {
				console.log("新增地址----");
				uni.navigateTo({
					url: '/packageAddress/address/address-list'
				})
			},
			async gotopay() {
				console.log(this.goodsList);
				// 创建订单
				this.orderParams.order_price = 0.01; //模拟支付都用0.1
				this.orderParams.consignee_addr = this.defaultAddress.area;

				this.orderParams.order_detail = JSON.stringify(this.goodsList.map(item => {
					return {
						goods_id: item.goods_id,
						goods_name: item.goods_name,
						goods_price: item.cart_counts * item.goods_price,
						counts: item.cart_counts,
						selectStatus: true
					}
				})) 
				this.orderParams.goods = this.goodsList.map(item => {
					return {
						goods_id: item.goods_id,
						goods_number: item.cart_counts,
						goods_price: item.cart_counts * item.goods_price
					}
				});
				
				// 1.创建订单
				const { list } = await unifyRequest(createOrder,this.orderParams);
				console.log(list);
				// 存储该订单到store
				this.addOrder(list);
				console.log(this.orderList);
				
				// 2.订单预支付
				const prepayList = await unifyRequest(prepayOrder,{order_number:list.order_number});
				console.log(prepayList);
				if(prepayList.meta.status !== 200) return this.$showMsg(prepayList.meta.msg)
				let payInfo = prepayList.list.pay;
				console.log(payInfo);
				
				
				//3.订单支付
				// 支付接口：需要小程序后台开通支付接口；只有企业注册商户号后才能开通支付接口
				const [err, succ] = await uni.requestPayment({
				    "provider": "wxpay", 
				    "orderInfo": list,
					"appid": "wx2e7b06a3cf8edff3",  // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
					"nonceStr": payInfo.nonceStr, // 随机字符串
					"package": payInfo.package,        // 固定值
					// "partnerid": "148*****52",      // 微信支付商户号
					// "prepayid": "wx202254********************fbe90000", // 统一下单订单号 
					"timeStamp": payInfo.timeStamp,        // 时间戳（单位：秒）
					"paySign": payInfo.paySign, // 签名，这里用的 MD5/RSA 签名
					"signType": payInfo.signType, // 签名，这里用的 MD5/RSA 签名
				})
				
				console.log(err,succ);
				// 4.查询支付结果，并跳转支付完成页面（成功、失败、取消）
				
			}
		},
		onLoad() {
			// 监听bjs-settle传过来的值
			const _This = this;
			uni.$on('gotopay', function(res) {
				_This.gotopay();
			});

			// 设置导航栏标题
			uni.setNavigationBarTitle({
				title: '宝酱小铺'
			})
			this.settleGoodsList = this.goodsList.filter(item => item.checked === true);
		},
		onUnload() {
			uni.$off('gotopay');
		}
	}
</script>

<style lang="scss">
	$grayText: #999999;
	$basicFontSize: 16px;
	$grayBgColor: #f4f4f4;
	$redColor: #bc2840;
	$whiteBgColor: #FFFFFF;
	$titleFont: 20px;

	.basic {
		padding: 10px;
		border-radius: 10px;
		font-size: 18px;
		background-color: $whiteBgColor;
		margin-bottom: 10px;
	}

	.basicTitle {
		display: flex;
		align-items: center;
		height: 80rpx;
		line-height: 80rpx;
		border-bottom: 1px solid $grayBgColor;
	}

	.displayCenter {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.settle-container {
		padding: 10px;
		background-color: $grayBgColor;

		.blank-consignee-info {
			height: 150rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			border-bottom: 4px dashed #2236cd;
			@extend .basic;

			.fill-in-consignee {
				font-size: $titleFont;
			}
		}

		.consignee-info {
			height: 240rpx;
			@extend .basic;

			.address-info {
				padding: 5px 0;

				.contacts {
					font-size: $basicFontSize;
					color: $grayText;
				}

				.address {
					padding: 5px 0;
					display: flex;
					justify-content: space-between;
					align-items: flex-start;

					.detail-address {}
				}
			}
		}

		.goods-info-box {
			@extend .basic;
			// height: fit-content;

			.title {
				@extend .basicTitle;
			}

			.bjs-goods {
				width: 92%;
				height: 180rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}

		.order-box {
			@extend .basic;
			// height: 480rpx;
			font-size: 17px;
			height: fit-content;

			.order-info {
				.order-info-list {
					height: 40px;
					display: flex;
					justify-content: space-between;
					font-size: 16px;
				}
			}

			.total-price {
				padding: 10px 0;
				display: flex;
				justify-content: flex-end;
				border-top: 1px solid $grayBgColor;
			}
		}
	}
</style>