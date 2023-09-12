<template>
	<view class="address-box" v-if="addressList.length>0" :style="'height:'+(contentHeight+90)+'px'">
		<view class="address-list" :style="'height:'+contentHeight+'px'">
			<block v-for="(item,index) in addressList" :key="index">
				<view class="address-info-box">
					<view class="address-info">
						<view class="user">
							<view class="name">{{item.name}}</view>
							<view class="tel">{{item.tel}}</view>
						</view>
						<view class="address">
							<span class="default-address" v-if="item.default">默认地址</span>
							{{item.area}}{{item.detailInfo}}
						</view>
					</view>

					<view class="add-icon">
						<template v-slot:edit>
							<uni-icons custom-prefix="bjsicons" type="bjs-edit" size="26"></uni-icons>
						</template>
					</view>
				</view>
			</block>
		</view>
	</view>
	<bjs-button></bjs-button>
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
				return getSystemHeight() - 90;
			},
		},
		data() {
			return {

			};
		},

	}
</script>

<style lang="scss">
	$fontsize: 20px;
	$grayBgColor: #f4f4f4;
	$redColor: #bc2840;
	$whiteBgColor: #FFFFFF;
	$fontColor: #9a9a9a;

	.address-box {
		background-color: $grayBgColor;
		display: flex;

		.address-list {
			padding: 10px;

			.address-info-box {
				display: flex;
				height: 160rpx;
				background-color: $whiteBgColor;
				padding: 20px;
				border-radius: 10px;
				margin-bottom: 10px;

				.address-info {
					width:80%;
					
					.user {
						display: flex;
						height: 36px;
						line-height: 24px;

						.name {}

						.tel {
							margin-left: 20px;
							color: $fontColor;
						}
					}

					.address {
						height: 40px;
						line-height: 23px;

						.default-address {
							padding: 3px 8px;
							background-color: #fae5e4;
							color: #af2e41;
							font-size: 13px;
							border-radius: 8px 0 8px 0;
						}

						.detail-address {}
					}
				}

				.add-icon {
					width: 20%;
					display: flex;
					align-items: center;
					justify-content: flex-end;
				}
			}
		}
	}
</style>