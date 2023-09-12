import { defineStore} from 'pinia'

export const useCartStore = defineStore('cart',{
	// pinia state类似vue的data,如果不使用()，就必须使用return返回对象
	state: () =>{
		return {
			goodsList: [],
			total: 0,
			totalPrice: 0,
			allChecked: false,
			allNotCheck: false,
		}
	},
	getters:{
		//  store 的 state 的计算值。推荐使用箭头函数，并且它将接收 state 作为第一个参数：
		goodsCount: (state) => state.goodsList.length,
	},
	actions:{
		addGoodsInfo(goodsInfo){
			// 如果商品存在，只更新cartCounts字段
			let curIndex = this.goodsList.findIndex(item=>item.goods_id===goodsInfo.goods_id);
			if(curIndex===-1){
				goodsInfo['cart_counts'] = 1;
				goodsInfo['checked'] = false;
				this.goodsList.push(goodsInfo);
			}else{
				this.goodsList.map(item=>{
					if(item.goods_id === goodsInfo.goods_id){
						// 没有则表示没有添加过（首次添加）
						item['cart_counts'] = item['cart_counts'] + 1;
					}
					return item;
				});
			}
		},
		getTotal(){
			let count = 0;
			this.goodsList.map(item=>{
				if(item.checked == true) count += item.cart_counts;
			})
			this.total = count;
		},
		getTotalPrice(){
			let price = 0;
			this.goodsList.map(item=>{
				// 计算价格直接计算选中的价格即可，因为this.totalPrice每次都会重新复制，没选中的不会再计算进去
				if(item.checked == true) price += item.goods_price * item.cart_counts;
			})
			this.totalPrice = price;
		},
		updateGoodsList(e,goods){
			this.goodsList.forEach((item,index)=>{
				if(goods.goods_id === item.goods_id) this.goodsList[index].cart_counts = e;
			});
			console.log(this.goodsList);
			// this.getTotal();
			// this.getTotalPrice();
			this.getTotalAndTotalPrice();
		},
		getTotalAndTotalPrice(){
			this.getTotal();
			this.getTotalPrice();
		},
		getAllChecked(){
			this.allChecked = this.goodsList.every(item=>item.checked===true);
		},
		getAllNotChecked(){
			this.allNotCheck = this.goodsList.every(item=>item.checked!==true);
		},
		ifAllCheck() {
			this.getAllChecked();
			this.getAllNotChecked();
		
			// this.getTotal();
			// this.getTotalPrice();
			this.getTotalAndTotalPrice();
		},
		changeAllCheck(){
			// this.allNotCheck = !this.allNotCheck;
			this.goodsList.map(item => {
				item.checked = !this.allChecked;
			})
			this.ifAllCheck();
		},
		deleteCartGoods(){
			this.goodsList = this.goodsList.filter(item=>item['checked']!==true);
			this.getTotalAndTotalPrice();
			this.allChecked = false;
		},
		sliderDeleteGoods(goods_id){
			this.goodsList = this.goodsList.filter(item=>item.goods_id !== goods_id)
			// this.getTotal();
			// this.getTotalPrice();
			this.getTotalAndTotalPrice();
		},
	},
	unistorage: true // 开启后对 state 的数据读写都将持久化
})