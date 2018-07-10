<style lang="less">
@import './own-space.less';
</style>

<template>
<div>
	<Card>
		<p slot="title">
			<Icon type="person"></Icon>
			个人信息
		</p>
		<div>
			<Form ref="userForm" :model="userForm" :label-width="100" label-position="right">
				<FormItem label="登录密码：">
					<Button type="text" size="small" @click="showEditPassword">修改密码</Button>
				</FormItem>
				<div>
					<Button type="primary" style="width: 100px;" :loading="save_loading" @click="handleback">返回</Button>
				</div>
			</Form>
		</div>
	</Card>
	<Modal v-model="editPasswordModal" :closable='false' :width="500">
		<h3 slot="header" style="color:#2D8CF0">修改密码</h3>
		<Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
			<FormItem label="原密码" prop="oldPass" :error="oldPassError">
				<Input v-model="editPasswordForm.oldPass" class="formInput" :type='oldpwd_type' placeholder="请输入现在使用的密码"></Input>
				<Icon type="eye" size='22' @click='showPWD("oldpwd_type")'></Icon>
			</FormItem>
			<FormItem label="新密码" prop="newPass">
				<Input v-model="editPasswordForm.newPass" class="formInput" :type='pwd_type' placeholder="请输入新密码，至少8位字符"></Input>
				<Icon type="eye" size='22' @click='showPWD("pwd_type")'></Icon>
			</FormItem>
			<FormItem label="确认新密码" prop="rePass">
				<Input v-model="editPasswordForm.rePass" class="formInput" :type='repwd_type' oldpwd_type placeholder="请再次输入新密码"></Input>
				<Icon type="eye" size='22' @click='showPWD("repwd_type")'></Icon>
			</FormItem>
		</Form>
		<div slot="footer">
			<Button type="text" @click="cancelEditPass">取消</Button>
			<Button type="primary" :loading="savePassLoading" @click="saveInfoAjax">保存</Button>
		</div>
		<Spin v-if='modelLoading' fix size='large'></Spin>
	</Modal>
</div>
</template>

<script>
export default {
	name: 'ownspace_index',
	data() {
		const valideRePassword = (rule, value, callback) => {
			if (value !== this.editPasswordForm.newPass) {
				callback(new Error('两次输入密码不一致'));
			} else {
				callback();
			}
		};
		return {
			oldpwd_type: 'password',
			pwd_type: 'password',
			repwd_type: 'password',
			modelLoading: false,
			userForm: {},
			save_loading: false,
			editPasswordModal: false, // 修改密码模态框显示
			savePassLoading: false,
			oldPassError: '',
			editPasswordForm: {
				oldPass: '',
				newPass: '',
				rePass: ''
			},
			passwordValidate: {
				oldPass: [{
					required: true,
					message: '请输入原密码',
					trigger: 'blur'
				}],
				rePass: [{
						required: true,
						message: '请再次输入新密码',
						trigger: 'blur'
					},
					{
						validator: valideRePassword,
						trigger: 'blur'
					}
				]
			},
			initPhone: '',
		};
	},
	methods: {
		// 修改登录密码
		showEditPassword() {
			this.resetform('editPasswordForm')
			this.editPasswordModal = true;
		},
		// 返回至主页
		handleback() {
			this.$router.push({
				path: '/'
			})
		},
		// 取消密码修改
		cancelEditPass() {
			this.editPasswordModal = false;
			this.resetform('editPasswordForm')
		},
		// 表单传输
		saveInfoAjax() {
			this.modelLoading = true;
			let api = this.$api.user.password_login
			let para = {
				old_pwd: this.editPasswordForm.oldPass,
				password: this.editPasswordForm.newPass,
				password_confirmation: this.editPasswordForm.rePass,
			}
			this.$axios.post(api, para).then(res => {
				this.$Message.success(res.data.message)
				this.editPasswordModal = false
				this.resetform('editPasswordForm')
				this.$store.dispatch("logoutRequest");
				this.$store.commit('clearOpenedSubmenu');
				this.$router.push({
					name: 'login'
				});
			}).catch(err => {
				console.log(err);
			}).then(() => {
				this.modelLoading = false;
			})
		},
		// 重置表单
		resetform(formName) {
			this.$refs[formName].resetFields();
		},
		// 密码明文
		showPWD(type) {
			if (this[type] == 'password') {
				this[type] = 'text'
			} else {
				this[type] = 'password'
			}
		}
	},
};
</script>
