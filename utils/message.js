export const showMsg = (msg = "数据加载失败。。。") => {
	uni.showToast({
		title: msg,
		icon: 'none',
	})
};