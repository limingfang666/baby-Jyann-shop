function formatPrice(price) {
	if(price==='' || price=== undefined) return 0.00;
	return '￥' + price.toFixed(2);
}

function formatPriceNoMark(price) {
	console.log(price);
	if(price==='' || price=== undefined) return 0.00;
	return price.toFixed(2);
}

function getSystemHeight(){
	// 内容区的高度根据wx.getSystemInfoSync()动态获取：总高度-navigateBar高度-自定义组件高度
	const res = wx.getSystemInfoSync();
	return res.windowHeight;
}

function splitToArr(str){
	if(str === "") return str;
	return str.split(",").slice(0,3);
}

function removeImgGap(imgAttr){
	// 去除图片间空隙，图片显示存在空隙 /<img/g replace方法第一个参数为正则表达式
	// 图片去除间隙使用display:block; box-sizing: border-box即可
	return imgAttr.replace(/<img/g,"<img style='display:block; box-sizing: border-box'")
}

export {
	removeImgGap,
	splitToArr,
	formatPrice,
	formatPriceNoMark,
	getSystemHeight
}