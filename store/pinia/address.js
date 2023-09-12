import { defineStore} from 'pinia'

export const useAddressStore = defineStore('address',{
	state: () =>{
		return {
			addressList: [
				 {"name":'小酱酱',"tel":'13318649098',"area":"广东省深圳市龙岗区","detailInfo":'吉华街道新梅子园1巷8号205',"default":true},
			],
		}
	},
	getters:{
		//  store 的 state 的计算值。推荐使用箭头函数，并且它将接收 state 作为第一个参数：
		defaultAddress: (state) => state.addressList.filter(item=>item.default === true)[0],
	},
	actions:{
		addAddress(address){
			if(address.default===true) this.addressList.map(item=>item.default = false);
			return this.addressList.push(address);
		},
	},
	unistorage: true // 开启后对 state 的数据读写都将持久化
})