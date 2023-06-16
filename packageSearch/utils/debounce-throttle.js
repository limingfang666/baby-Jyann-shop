
export const debounce = (func, wait) => {
	let timerId = null;
	return function(){
	    let _This = this,
	        args = arguments;
	     if(timerId) clearTimeout(timerId);
	     timerId = setTimeout(function(){
	        func.apply(_This,args);
	        },wait);
	}
}

function throttle(){
	console.log("throttle");
}

let _ = {
    throttle,
    debounce
};

//ES6导出，export default {}属于ES6规范 ；ES6引入 import _ from "@/utils/debounce-throttle.js"
export default _;
