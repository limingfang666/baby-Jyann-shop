<template>
	<view class="search-box">
		<view class="search-bar">
			<uni-search-bar placeholder="" class="search-bar-content" @confirm="search" v-model="searchVal"
				@input="input" @cancel="cancel" @clear="cancel" :focus="true" bgColor="#EEEEEE" radius="50" cancelButton="always">
				<template v-slot:searchIcon>
					<uni-icons class="search-bar-icon" custom-prefix="bjsicons" type="bjs-search" size="30"
						@click="search"></uni-icons>
				</template>
			</uni-search-bar>
		</view>

		<!-- 搜索建议 -->
		<view class="search-advise" v-if="searchList.length>0">
			<view v-for="item in searchList" :key="item.goods_id" class="search-advise-item">
				<uni-icons class="advise-icon" type="search" size="26" @click="search" color="#c6c6c8"></uni-icons>
				<view class="advise-item">{{item.goods_name}}</view>
			</view>
		</view>

		<!-- 搜索历史 -->
		<!-- historyList是从mapState中获取，直接判断.length>0会报undefined -->
		<view v-if="searchList.length===0">
			<view class="search-history" v-if="historyList.length>0">
				<view class="search-history-title">
					<view class="history-title">搜索历史</view>
					<view class="history-delete">
						<template v-slot:searchIcon>
							<uni-icons class="search-bar-icon" custom-prefix="bjsicons" type="bjs-delete" size="40"
								@click="()=>this.clearHistory()"></uni-icons>
						</template>
					</view>
				</view>
				<view class="search-history-item">
					<block v-for="(item,index) in historyList" :key="index">
						<navigator class="history-item" url="/packageGoods/goods-list/goods-list" open-type="navigate">
							{{item}}
						</navigator>
					</block>
				</view>
			</view>
			<view class="search-favorite">
				<view class="search-favorite-title">
					<text class="favorite-title">心选热搜</text>
					<template v-slot:fireFilled>
						<uni-icons custom-prefix="bjsicons" type="bjs-hot" size="30"></uni-icons>
					</template>

				</view>
				<view class="search-favorite-item">
					<view class="favorite-list" v-for="(item,index) in favoriteList" :key="index">
						<view class="favorite-text" :style="index<=2?'color:white':'color:black'">{{index+1}} </view>
						<view class="favorite-icon">
							<template v-slot:searchIcon>
								<uni-icons custom-prefix="bjsicons"
									:type="index<=2?'bjs-shuqian-red':'bjs-shuqian-gray'" size="36"></uni-icons>
							</template>
						</view>
						<view class="favorite-name">{{item}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex'
	import {
		unifyRequest
	} from '@/composables/unify-request'
	import {
		getSearchAdvise
	} from "@/api/api.ts"
	import _ from "@/packageSearch/utils/debounce-throttle.js"


	export default {
		data() {
			return {
				searchVal: '',
				favoriteList: ['睡袋', '水杯', '凉席', '驱蚊', '口红', '蚊香液', '马桶', '洗衣液', '保温杯', '风扇'],
				timer: null,
				// {goods_id: 36651,goods_name: "郑品 整套黑诗陶瓷茶具套装 祥云电热炉茶盘套装ZT-13KSDF10"}
				searchList: [],
			};
		},
		computed: {
			...mapState('history', ['historyList']),
		},
		onLoad() {},
		methods: {
			cancel(){
				// 取消搜索，searchVal置空，searchList置[]
				this.searchList = [];
			},
			// 映射 history 中的mutations方法
			...mapMutations('history', ['addHistory', 'clearHistory']),
			search() {
				// 只有点击搜索时设置搜索历史
				this.updateHistory(this.searchVal);
			},
			input: _.debounce(function(e) {
				this.searchVal = e;
				this.searchAdvise(this.searchVal);
				// 自动搜索时也需要设置搜索历史
				this.updateHistory(this.searchVal);
			}, 1000),
			async searchAdvise(keyword) {
				// keyword不为空才发起请求
				if(keyword==='') return;
				const {
					list
				} = await unifyRequest(getSearchAdvise, keyword);
				this.searchList = list;
			},
			updateHistory(val) {
				if(val==='') return;
				// 更新之前先去重
				let curValIndex = this.historyList.findIndex(item => val === item)
				// 找到了将其放在最前面，无值则添加
				if (curValIndex === -1) this.historyList.unshift(val)
				else {
					// 先删除再添加
					this.historyList.splice(curValIndex, 1);
					this.historyList.splice(0, 0, val);
				}

				// 将history持久化到本地
				this.addHistory(this.historyList);
			}
		}
	}
</script>

<style lang="scss">
	.search-box {
		height: fit-content;
		font-size: 14px;

		.search-bar {
			height: 30%;

			.uni-searchbar__box {
				// icon图标靠左
				justify-content: flex-start;
			}
		}
		
		.search-advise{
			.search-advise-item{
				display: flex;
				margin: 0 10px;
				height: 50px;
				line-height: 50px;
				
				.advise-icon{}
				.advise-item{
					margin-left: 10px;
					font-size: 16px;
					// 文字超出后不换行使用...表示
					word-wrap: normal;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					
				}
			}
		}

		.search-history {
			height: fit-content;
			margin: 10px 10px;

			.search-history-title {
				display: flex;
				// 首个元素放置于起点，末尾元素放置于终点。
				justify-content: space-between;
				height: 30px;
				line-height: 30px;
				font-size: 16px;
			}

			.search-history-item {
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;

				.history-item {
					display: flex;
					justify-content: center;
					height: 30px;
					line-height: 30px;
					padding: 0 20rpx;
					margin-top: 10px;
					margin-right: 10px;
					border-radius: 40rpx;
					background-color: #ebebeb;
					// 根据文字长短自适应
					width: fit-content;
					height: fit-content;
					font-size: 13px;
				}

			}
		}

		.search-favorite {
			width: 100%;
			height: fit-content;

			.search-favorite-title {
				margin: 20px 10px 10px 10px;
				font-size: 16px;
				display: flex;
				align-items: center;
			}

			.search-favorite-item {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				height: fit-content;
				margin-left: 2px;

				.favorite-list {
					display: flex;
					width: 170px;
					height: 40px;
					position: relative;

					.favorite-text {
						position: absolute;
						z-index: 2;
						width: 30px;
						height: 36px;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 11px;
					}

					.favorite-icon {
						position: absolute;
						z-index: 1;
					}

					.favorite-name {
						position: absolute;
						z-index: 3;
						left: 30px;
						height: 36px;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 15px;
					}
				}
			}
		}
	}
</style>