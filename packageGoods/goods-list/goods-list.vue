<template>
	<view class="goods-list-box">
		<view class="goods-list-header">
			<view :class="['summary',tabIndex===0?'active':'']" @click="switchTab(0)">综合</view>
			<view class="sales-volume-box">
				<view :class="['sales-volume',tabIndex===1?'active':'']" @click="switchTab(1)">
					销量
				</view>
				<template v-slot:arrowup>
					<uni-icons class="sales-icons" @click="switchSaleIcon" custom-prefix="bjsicons" 
					:type="saleIcon" size="24"></uni-icons>
				</template>
			</view>
			<view :class="['news',tabIndex===2?'active':'']" @click="switchTab(2)">新品</view>
			<view class="price-box">
				<view :class="['price',tabIndex===3?'active':'']" @click="switchTab(3)">
					价格
				</view>
				<template v-slot:arrowup>
					<uni-icons class="sales-icons" custom-prefix="bjsicons" @click="switchPriceIcon" 
					:type="priceIcon" size="24"></uni-icons>
				</template>
				
			</view>
		</view>
		<view class="goods-list">
			<bjs-goods class="goods" :goods="goods" v-for="goods in goodsList" :key="goods.goods_id"></bjs-goods>
			<view class="goods-list-bottom" v-if="isBottom">
				<template v-slot:shop>
					<uni-icons class="bottom-icons" custom-prefix="bjsicons" type="bjs-kids" size="40"></uni-icons>
				</template>
				<text class="bottom-text">已经到底啦~</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getGoodsList
	} from "@/api/api"
	import {
		unifyRequest
	} from '@/composables/unify-request'


	export default {
		data() {
			return {
				params: {
					query: '',
					cid: '',
					pagenum: 1,
					pagesize: 10
				},
				total: 0,
				goodsList: [],
				isBottom: false,
				tabIndex: 0, 
				saleIcon: 'bjs-no-sort',
				priceIcon: 'bjs-no-sort',
			};
		},
		onLoad(options) {
			this.params.cid = options.cid;
			this.params.query = options.query;
			// 发起请求
			this.getGoodsList();
		},
		onPullDownRefresh() {
			this.params.pagenum = 1;
			this.goodsList = [];
			this.getGoodsList(true);
		},
		onReachBottom() {
			this.params.pagenum += 1;
			// 如果加载完成则显示触底样式
			if (this.params.pagenum * this.params.pagesize >= this.total) return this.isBottom = true;

			this.getGoodsList();
		},
		methods: {
			async getGoodsList(isPullDownRefresh = false) {
				const {
					list
				} = await unifyRequest(getGoodsList, this.params);

				this.goodsList = [...this.goodsList, ...list.goods];
				this.total = list.total;

				if (isPullDownRefresh) uni.stopPullDownRefresh();
			},
			switchTab(index){
				this.tabIndex = index;
				// 0 综合 1销量 2新品 3价格
				if(index === 1) {
					this.saleIcon = 'bjs-sort-down';
					this.priceIcon = 'bjs-no-sort';
				}
				else if(index === 3){
					this.priceIcon = 'bjs-sort-up';
					this.saleIcon = 'bjs-no-sort';
				}else{
					this.priceIcon = 'bjs-no-sort';
					this.saleIcon = 'bjs-no-sort';
				}
				
				switch(index){
					case 1:
						this.sortGoodsBySalesVolume();
						break;
					case 2:
						this.sortGoodsByNews();
						break;
					case 3:
						this.sortGoodsByPrice();
						break;
					default:
						this.sortGoodsBySummary();
				}
			},
			
			switchSaleIcon(){
				if(this.tabIndex !== 1) return;
				if(this.saleIcon === 'bjs-sort-up') this.saleIcon = 'bjs-sort-down';
				else this.saleIcon = 'bjs-sort-up';
				
				this.sortGoodsBySalesVolume();
			},
			switchPriceIcon(){
				if(this.tabIndex !== 3) return;
				if(this.priceIcon === 'bjs-sort-up') this.priceIcon = 'bjs-sort-down';
				else this.priceIcon = 'bjs-sort-up';
				
				this.sortGoodsByPrice();
			},
			// 综合排序，按id排
			sortGoodsBySummary(){
				this.goodsList.sort((a,b)=> b.goods_id - a.goods_id);
			},
			// 按销量或价格对商品进行排序
			sortGoodsByPrice(){
				if(this.priceIcon === 'bjs-sort-up') this.goodsList.sort((a,b)=> a.goods_price - b.goods_price);
				else this.goodsList.sort((a,b)=> b.goods_price - a.goods_price);
			},
			// 销量暂时按照商品添加时间add_time
			sortGoodsBySalesVolume(){
				if(this.saleIcon === 'bjs-sort-up') this.goodsList.sort((a,b)=> a.add_time - b.add_time);
				else this.goodsList.sort((a,b)=> b.add_time - a.add_time);
			},
			// 新品暂时按照商品更新时间upd_time
			sortGoodsByNews(){
				this.goodsList.sort((a,b)=> a.upd_time - b.upd_time);
			}
		}

	}
</script>

<style lang="scss">
	.goods-list-box {
		.goods-list-header {
			height: 50px;
			line-height: 50px;
			display: flex;
			justify-content: space-around;
			
			.sales-volume-box, .price-box{
				display: flex;
			}

			.summary, .sales-volume, .news, .price{
				// 使用fit-content可以让伪元素的宽度适应文字宽度
				width: fit-content;
				text-align: center;
				
				.bjs-no-sort{
					justify-content: flex-start;
				}
				
				&.active{
					position: relative;
					
					&::after {
						content: '';
						position: absolute;
						top: 46px;
						left: 0;
						width: 100%;
						border-radius: 2px;
						border-bottom: 4px solid #3a3a3a;
					}
				}
			}

		}

		.goods-tips {
			color: #666668;
			font-size: 13px;
			height: 24px;
			line-height: 24px;
		}

		.goods-list {
			background-color: #f1f1f1;
			width: 100%;
			height: fit-content;
			//justify-content默认flex-start左对齐，子元素只设置margin top left就能上下左右margin值相同
			display: flex;
			flex-wrap: wrap;

			.goods {
				width: 46%;
				height: 300px;
				// 只设置margin top left,
				margin: 10px 0 0 10px;
				background-color: #ffffff;
				border-radius: 8px;
			}

			.goods-list-bottom {
				display: flex;
				flex-direction: column;
				justify-content: center;
				width: 100%;
				height: 60px;
				padding-bottom: 10px;

				.bottom-icons {
					display: flex;
					justify-content: center
				}

				.bottom-text {
					@extend .goods-tips;
					font-size: 14px;
					text-align: center;
				}
			}
		}

	}
</style>