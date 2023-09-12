import {
	useUserStore
} from "@/store/pinia/user"
const store = useUserStore();


const baseUrl = {
	PROD: '', // 生产环境地址
	DEV: 'https://api-hmugo-web.itheima.net/api/public/v1'   // 开发环境地址
}
// 请求拦截器
uni.addInterceptor('request', {
	invoke(args) {
		console.log('发送请求前拦截==》》',args)
		// 发送请求前设置请求token
		console.log(store.$state.token);
		
		if(store.$state.token==='') return showToast("无token");
		args.header["Authorization"] = store.$state.token;
	},
	success(res) {
		// 请求成功响应后
		console.log("请求成功",res);
	}, 
	fail(err) {
		// 请求失败
		console.log('interceptor-fail',err)
	}, 
	complete(res) {
		// 完成请求后
		hideToast();
	}
})

uni.addInterceptor({
  returnValue(args) {
    // 只返回 data 字段
    return args.data
  }
})

const showToast = (title) => {
    uni.showToast({
        title: title,
        icon: 'none'
    })
}
const hideToast = () => {
    uni.hideToast();
}
const request = (obj) => {
	obj.url = obj.url || '';
	obj.method = obj.method || 'GET';
	obj.data = obj.data || {};
	obj.header = obj.header || 'Content-Type: application/json; charset=utf-8';
	obj.loading = obj.loading === false ? false : true;
    let loadingStatus = true;
	setTimeout(()=>{
            if (loadingStatus && obj.loading) {
                uni.showLoading({
                        title:'加载中',
                        mask: true
                })
            }
	}, 800) // 800毫秒后如果loadingStatus === false 则表示请求返回了，不显示loading
	return new Promise((resolve, reject) => {
		uni.request({
			url: (process.env.NODE_ENV === 'development' ? baseUrl.DEV : baseUrl.PROD) + obj.url,
			method: obj.method,
			data: obj.data,
			header: {
				'Content-Type': obj.header
			},
			success: res => { // 服务器成功返回的回调函数
				console.log('res=>>>',res)
                if (res.statusCode === 200) {
				let result = res.data;
				reject(result);
					} else { // 返回值非 200，强制显示提示信息
						loadingStatus = false
						showToast('[' + res.statusCode + '] 系统处理失败');
						reject('[' + res.statusCode + '] 系统处理失败');
					}
			},
			fail: (err) => { // 接口调用失败的回调函数
				if (err.errMsg != 'request:fail abort') {
					loadingStatus = false
					showToast('连接超时，请检查您的网络。');
					reject('连接超时，请检查您的网络。');
				}
			},
			complete: () => {
				if (loadingStatus && obj.loading) {
				  hideToast();
				  loadingStatus = false;
				}
			}
		})
	})
}

export default request;
