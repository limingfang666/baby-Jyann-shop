import { showMsg } from '@/utils/message.js'

export async function unifyRequest(funcName: Function, params = {},  errMsg = '请求失败', successMsg = ""){
	
	const { data: res } = await funcName(params);
	
	if(res.meta.status !== 200) showMsg(errMsg);
	
	if(successMsg) showMsg(successMsg);
	
	return {
		list: res.message,
		meta: res.meta
	}
}