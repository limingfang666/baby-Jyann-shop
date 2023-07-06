import * as Pinia from 'pinia';
import { createUnistorage } from '@/uni_modules/pinia-plugin-unistorage'

const piniaStore = Pinia.createPinia();

piniaStore.use(createUnistorage())

export default piniaStore;