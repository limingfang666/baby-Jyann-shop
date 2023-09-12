<template>
	<view class="mine-box" :style="'height:'+contentHeight+'px'">
		<!-- 用户信息 -->
		<view class="user-box" :style="'background-image:'+(token!==''?bgImage:'')">
			<view class="user-info">
				<view class="user">
					<view class="avatar">
						<template v-slot:up>
							<uni-icons custom-prefix="bjsicons" type="bjs-avatar" size="76"></uni-icons>
						</template>
						<!-- <image v-if="loginUser.avatarUrl" :src="loginUser.avatarUrl"></image> -->
					</view>
					<view class="login-status" v-if="token===''">
						<view class="status" @click="login">未登录</view>
						<view class="vip-identity">
							<template v-slot:up>
								<uni-icons custom-prefix="bjsicons" type="bjs-VIP" size="16"></uni-icons>
							</template>
							<view class="identity">
								会员权益
							</view>
						</view>
					</view>
					<view class="login-info" v-if="token!==''">
						<view class="status">{{loginUser.nickName}}</view>
						<view class="tel">185****9098</view>
					</view>
				</view>
				<view class="vip-QRcode">
					<template v-slot:up>
						<uni-icons custom-prefix="bjsicons" type="bjs-QRCode" size="30"></uni-icons>
					</template>
					<view>会员码</view>
				</view>
			</view>
			<view class="vip-info" v-if="token!==''">
				<view class="vip">
					<view class="vip-level">
						白卡会员
					</view>
					<van-button class="vip-button" type="primary" custom-style="" round
						color="#bc2840">会员中心</van-button>
				</view>
				<!-- 比例 -->
				<view class="vip-ratio">
				</view>
				<view class="vip-level-desc">
					<span class="cur-grade">{{currentValue}}</span>/300 距离金卡会员还需消费221元
				</view>
			</view>
		</view>
		<!-- 添加宝宝信息：无宝宝信息时 -->
		<view class="add-baby-info-box" v-if="token!==''">
			<bjs-search :customIcon="true" :iconType="'bjs-baby-avatar'" width="356px" height='72rpx'
				bg-color="rgba(153,153, 153, 0.2)" placeholderColor="#000" placeholder="添加宝宝信息,领取专属权益" color="#000">
				<template v-slot:button>
					<view class="">
						去添加
						<uni-icons class="go-add-baby-info" type="forward"></uni-icons>
					</view>
				</template>
			</bjs-search>
		</view>
		<view class="account-box" v-if="accountIcons">
			<bjs-nav-item class="account-item" v-for="(item,index) in accountIcons" :key="index" :content="item.content"
				:is-icon="false" :title="item.title"></bjs-nav-item>
		</view>
		<view class="order-box">
			<view class="basic-title">
				<view>我的订单</view>
				<view class="all-orders">
					全部订单
					<uni-icons type="forward" color="#9a9a9a"></uni-icons>
				</view>
			</view>
			<view class="my-order">
				<bjs-nav-item v-for="(item,index) in orderIcons" :key="index" class="order-item"
					:icon-type="item.iconType" :title="item.title"></bjs-nav-item>
			</view>
		</view>
		<view class="service-box">
			<view class="basic-title">
				我的服务
			</view>
			<view class="my-service">
				<bjs-nav-item v-for="(item,index) in serviceIcons" :key="index" class="service-item"
					:icon-type="item.iconType" :title="item.title"></bjs-nav-item>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		setTabBarInfo
	} from "@/composables/tabBar-logoInfo"
	import {
		mapState,
		mapGetters,
		mapActions
	} from 'pinia'
	import {
		useUserStore
	} from "@/store/pinia/user"
	import {
		getSystemHeight
	} from "@/utils/common"

	export default {
		computed: {
			...mapState(useUserStore, ['token','loginUser']),
			contentHeight() {
				return getSystemHeight();
			}
		},
		data() {
			return {
				bgImage:'url("/static/goods-icons/vip-card.jpg")',
				currentValue: 79,
				// 我的服务选项数据
				serviceIcons: [{
						title: '我的试用',
						iconType: 'bjs-on-trial'
					},
					{
						title: '积分商城',
						iconType: 'bjs-points-mall'
					},
					{
						title: '黑卡尝鲜',
						iconType: 'bjs-black-card'
					},
					{
						title: '我的宝宝',
						iconType: 'bjs-baby-bottle'
					},
					{
						title: '我的地址',
						iconType: 'bjs-my-address'
					},
					{
						title: '售后服务',
						iconType: 'bjs-after-sales'
					},
					{
						title: '育儿百科',
						iconType: 'bjs-baby-book'
					},
					{
						title: '在线客服',
						iconType: 'bjs-online-service'
					},
					{
						title: '扫一扫',
						iconType: 'bjs-scan'
					},
					{
						title: '我的周期购',
						iconType: 'bjs-cycle-purchase'
					},
					{
						title: '意见反馈',
						iconType: 'bjs-feedback'
					},
					{
						title: '人工智能',
						iconType: 'bjs-intelligence'
					},
					{
						title: '我的社区',
						iconType: 'bjs-my-community'
					},
				],
				orderIcons: [{
						title: '待付款',
						iconType: 'bjs-being-pay'
					},
					{
						title: '待发货',
						iconType: 'bjs-being-send'
					},
					{
						title: '待收货',
						iconType: 'bjs-being-received'
					},
					{
						title: '退换/售后',
						iconType: 'bjs-after-sales'
					},
				],
				accountIcons: [{
						title: '账户余额',
						content: '0.00'
					},
					{
						title: '积分',
						content: '790'
					},
					{
						title: '优惠券',
						content: '0'
					},
					{
						title: '礼遇卡',
						content: '0'
					},
					{
						title: '权益卡',
						content: '0'
					},
				]
			};
		},
		onLoad() {
			// 给tabBar页面设置徽标
			setTabBarInfo();
		},
		methods:{
			login(){
				uni.navigateTo({
					url:'/packageUser/login/login'
				})
			}
		}
	}
</script>

<style lang="scss">
	$fontsize: 20px;
	$grayBgColor: #f4f4f4;
	$redColor: #bc2840;
	$whiteBgColor: #FFFFFF;
	$fontColor: #9a9a9a;

	.basic-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		line-height: 80rpx;
		font-size: $fontsize;
		margin-left: 10px;

	}

	.display-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-left: 10px;
	}

	.mine-box {
		width: 100%;
		background-color: $grayBgColor;
		/* 不支持线性的时候显示 */
		background-image: linear-gradient(to bottom, $whiteBgColor 50%, $grayBgColor 60%);

		.user-box {
			padding: 4px 0 8px 0;
			margin: 10px;
			border-radius: 10px;
			
			.user-info {
				display: flex;
				justify-content: space-between;
				margin: 10px;

				.user {
					display: flex;

					.avatar,
					.login-status{
						@extend .display-center;
						// 父级有margin 10
						margin-left:0;

						.status {
							font-size: 24px;
							margin-bottom: 10px;
						}

						.vip-identity {
							display: flex;
							align-items: center;

							.uniui-bjs-VIP {
								background-color: #eabea3;
								padding: 2px;
								border-radius: 12px;
							}

							.identity {
								background-color: #eabea3;
								color: #7f4833;
								padding: 2px 6px;
								font-size: 13px;
								border-radius: 20px;
							}
						}
					}

					.login-info {
						display: flex;
						flex-direction: column;
						justify-content: flex-start;
						margin-left: 10px;

						.status {
							font-size: 24px;
							margin-bottom: 10px;
						}
					}
				}
				.vip-QRcode{
					@extend .display-center;
				}
			}

			.vip-info {
				margin: 10px;

				.vip {
					display: flex;
					justify-content: space-between;

					.vip-level {
						font-weight: bold;
						font-size: 30px;
					}

					.vip-button {
						.van-button--normal{
							padding:4px 15px;
							height: 30px;
							line-height: 30px;
							font-size: 15px;
						}
					}
				}

				.vip-ratio {}

				.vip-level-desc {
					.cur-grade {
						font-size: 20px;
						font-weight: bold;
					}
				}
			}

		}

		.add-baby-info-box {
			margin-left: 10px;

			.go-add-baby-info {
				width: 40px;
				height: 90%;
				border-radius: 16px;
				ackground-color: #000;
			}
		}

		.account-box {
			display: flex;
			margin: 10px;

			.account-item {
				width: 25%;
				height: 86px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
			}
		}

		.service-box,
		.order-box,
		{
		background-color: $whiteBgColor;
		border-radius: 10px;
		margin: 10px;

		.my-service,
		.my-order {
			display: flex;
			flex-wrap: wrap;

			.service-item,
			.order-item {
				width: 25%;
				height: 86px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}
		}
	}
	}

	.all-orders {
		color: $fontColor;
		font-size: 15px;
	}

	// 登录框padding值
	.bjs-search-box .placeholder {
		height: 72rpx;
		line-height: 72rpx;
	}

	.go-add-baby-info .uniui-forward {
		background-color: #d7d7d7;
		padding: 6px;
		margin-right: 12px;
		border-radius: 16px;
	}
</style>