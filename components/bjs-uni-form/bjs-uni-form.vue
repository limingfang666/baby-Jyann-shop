<template>
	<view class="">
			<uni-forms :modelValue="formData">
				<uni-forms-item label="姓名" name="name">
					<uni-easyinput type="text" v-model="formData.name" placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item label="年龄" name="age">
					<input type="text" v-model="formData.age" placeholder="请输入年龄" />
				</uni-forms-item>
				<uni-forms-item required name="hobby" label="兴趣爱好">
					<uni-data-checkbox multiple v-model="formData.hobby" :localdata="formData.hobby"/>
				</uni-forms-item>
			</uni-forms>
			<button @click="submitForm">Submit</button>
		</view>
</template>

<script>
	export default {
		name:"bjs-uni-form",
		props:{
			formData:{
				type: Object,
				default:{}
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">

</style>