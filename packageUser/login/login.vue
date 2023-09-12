<template>
	<view class="login-box">
		<view class="project">
			<uni-icons custom-prefix="bjsicons" type="bjs-avatar" size="100"></uni-icons>
			<view class="project-name">
				宝酱小铺
			</view>
		</view>
		<van-button type="primary" block @click="wxLogin">微信登录</van-button>
		<van-button type="primary" plain block>手机号登录/注册</van-button>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapActions
	} from 'pinia'
	import {
		useUserStore
	} from "@/store/pinia/user"
	import {
		unifyRequest
	} from '@/composables/unify-request'
	import {
		getToken
	} from '@/api/api'

	export default {
		computed: {
			...mapState(useUserStore, ['loginUser','token']),
		},
		data() {
			return {
				// 获取后端token的请求参数
				query: {
					// 用户登录凭证|必要，可通过 [uni.login()]获取
					code: '',
					// 完整用户信息密文|必要，可通过 getUserInfo 获取
					encryptedData: '',
					// 加密算法的初始向量|必要，可通过 getUserInfo 获取
					iv: '',
					// 用户信息原始数据字符串|必要，可通过 getUserInfo 获取，JSON.stringify() 转字符串
					rawData: '',
					// 使用 sha1得到字符串|必要，可通过 getUserInfo 获取
					signature: '',
				}

			};
		},
		methods: {
			...mapActions(useUserStore, ['addLoginUser','updateToken']),
			wxLogin() {
				const _This = this;
				// 1:通过uni.login获取code
				
				uni.login({
					provider: 'weixin', //使用微信登录
					success: function(loginRes) {
						let {
							errMsg,
							code
						} = loginRes;
						if (errMsg !== "login:ok") return _This.$showMsg("登陆失败");
						_This.query.code = loginRes.code;

						// 2:通过uni.getUserInfo获取encryptedData，iv，rawData，signature
						uni.getUserInfo({
							provider: 'weixin',
							success: async function(infoRes) {
								let {
									errMsg,
									encryptedData,
									iv,
									rawData,
									signature,
									userInfo
								} = infoRes;
								if (errMsg !== "getUserInfo:ok") _This.$showMsg("获取用户信息失败");
								
								_This.addLoginUser(userInfo);
								_This.query = {
									// 测试用code
									code: loginRes.code,
									encryptedData: encryptedData,
									iv: iv,
									rawData: rawData,
									signature: signature
								}

								// 3: 发起请求获取token
								// const {
								// 	list
								// } = await unifyRequest(getToken, _This.query);
								
								//4.获取token更新本地token。 code接口原因token不能获取只能用测试用固定token
								// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo
								_This.updateToken("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
								
								// 5.有token后代表登录成功，可以回到我的，或者购物袋页面
								uni.navigateBack();
							}
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.login-box {
		.project {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 30px 0;

			.project-name {
				font-size: 30px;
			}
		}
	}
</style>