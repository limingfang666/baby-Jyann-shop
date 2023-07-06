
import { mapStores, mapGetters } from 'pinia'
import { useCartStore } from "@/store/pinia/cart"
	
export function setTabBarInfo(){
	
	const store = useCartStore();
	
	uni.setTabBarBadge({
	  index: 3,
	  text: store.goodsCount+''
	})
}