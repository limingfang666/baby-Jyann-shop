"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_message = require("./utils/message.js");
const store_store = require("./store/store.js");
const store_index = require("./store/index.js");
require("./store/history.js");
require("./uni_modules/pinia-plugin-unistorage/index.js");
if (!Math) {
  "./pages/home/home.js";
  "./pages/categories/categories.js";
  "./pages/cart/cart.js";
  "./pages/community/community.js";
  "./pages/mine/mine.js";
  "./packageSearch/search/search.js";
  "./packageGoods/goods-detail/goods-detail.js";
  "./packageGoods/goods-list/goods-list.js";
  "./packageSettle/settle/settle.js";
  "./packageAddress/address/address-list.js";
  "./packageAddress/address/address-add.js";
  "./packageUser/login/login.js";
}
const _sfc_main = {
  onLaunch: function() {
  },
  onShow: function() {
  },
  onHide: function() {
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/study/project/baby-Jyann-shop/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.config.globalProperties.$showMsg = utils_message.showMsg;
  app.use(store_store.store);
  app.use(store_index.piniaStore);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
