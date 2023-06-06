"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_message = require("./utils/message.js");
const store_store = require("./store/store.js");
require("./store/history.js");
if (!Math) {
  "./pages/home/home.js";
  "./pages/categories/categories.js";
  "./pages/cart/cart.js";
  "./pages/community/community.js";
  "./pages/mine/mine.js";
  "./packageSearch/search/search.js";
  "./packageGoods/goods-detail/goods-detail.js";
  "./packageGoods/goods-list/goods-list.js";
  "./packageCart/settle/settle.js";
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
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
