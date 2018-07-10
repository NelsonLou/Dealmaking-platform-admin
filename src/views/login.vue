<style lang="less">
@import './login.less';
.img {
    width: 100px;
    height: 35px;
    margin-right: 20px;
}
</style>

<template>
<div class="login" @keydown.enter="handleSubmit">
	<div class="login-con">
		<Card :bordered="false">
			<p slot="title">
				<Icon type="log-in"></Icon>
				登录
			</p>
			<div class="form-con">
				<Form ref="loginForm" :model="form" :rules="rules">
					<FormItem prop="userName">
						<Input v-model="form.userName" placeholder="请输入用户名">
						<span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
						</Input>
					</FormItem>
					<FormItem prop="password">
						<Input type="password" v-model="form.password" placeholder="请输入密码">
						<span slot="prepend">
                            <Icon :size="14" type="locked"></Icon>
                        </span>
						</Input>
					</FormItem>
					<FormItem prop="verification_code" class="clearfloat">
						<Input class="left" style="width:100px" v-model="form.code" placeholder="验证码">
						<span slot="prepend">
                            <Icon :size="18" type="key"></Icon>
                        </span>
						</Input>
						<Tooltip content="点击刷新验证码" class="right" placement="right">
							<img class="img" @click='getVerificationCode()' :src="verificationApi" alt="">
						</Tooltip>
					</FormItem>
					<FormItem>
						<Button @click="handleSubmit" type="primary" long>登录</Button>
					</FormItem>
				</Form>
			</div>
			<Spin v-if='pageLoaing' size='large' fix></Spin>
		</Card>
	</div>
</div>
</template>

<script>
import Cookies from 'js-cookie';
import md5 from 'js-md5';
export default {
	data() {
		return {
			verificationImg: '',
			verificationApi: '',
			pageLoaing: false,
			Randomcode: '',
			form: {
				userName: '',
				password: '',
				code: '',
			},
			rules: {
				userName: [{
					required: true,
					message: '账号不能为空',
					trigger: 'blur'
				}],
				password: [{
					required: true,
					message: '密码不能为空',
					trigger: 'blur'
				}]
			}
		};
	},
	mounted() {
		this.getVerificationCode()
	},
	methods: {
		getVerificationCode() {
			this.Randomcode = this.RandomNum(1, 100)
			this.verificationApi = this.$api.config.url + this.$api.common.code + this.Randomcode
		},
		handleSubmit() {
			this.$refs.loginForm.validate((valid) => {
				if (valid) {
					this.pageLoaing = true
					let para = {
						account: this.form.userName,
						password: this.form.password,
						encode: this.Randomcode,
						code: this.form.code,
					}
					this.$store.dispatch('loginRequest', para).then(res => {
						if (res) {
							this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
							this.$router.push({
								name: 'home_index'
							});
						} else {
							this.form.password = ''
						}
						this.pageLoaing = false
					})
				}
			});
		},
		randomString(len) {　　
			var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/ 　　
			var maxPos = $chars.length;　　
			var pwd = '';　　
			for (let i = 0; i < len; i++) {　　　　
				pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
			}　　
			return pwd;
		},
		RandomNum(Min, Max) {
			var Range = Max - Min;
			var Rand = Math.random();
			var num = Min + Math.floor(Rand * Range);
			return this.randomString(num)
		},
	}
};
</script>

<style>

</style>
