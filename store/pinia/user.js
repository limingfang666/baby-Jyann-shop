import { defineStore} from 'pinia'

export const useUserStore = defineStore('user',{
	state: () =>{
		return {
			loginUser:{},
			token:''
		}
	},
	getters:{
	},
	actions:{
		addLoginUser(user){
			this.loginUser = user;
		},
		updateToken(token){
			this.token = token;
		}
	},
	unistorage: true // 开启后对 state 的数据读写都将持久化
})