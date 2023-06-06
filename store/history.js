import { createStore } from 'vuex'

	// 注意state是对象不是方法
	const state = {
		historyList: uni.getStorageSync("history") || []
	}
	
	const getters = () =>{}
	
	const actions = {}
	
	const mutations = {
		addHistory: (state, payload) => {
			state.historyList = payload;
			uni.setStorageSync('history', payload);
		},
		clearHistory:(state, payload)=>{
			state.historyList = [];
			uni.removeStorageSync('history');
		}
	}

export default {
	namespaced: true,
	state,
	actions,
	mutations
};