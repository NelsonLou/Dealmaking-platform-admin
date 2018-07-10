<!-- 资金账户 -->
<template>
<div id="capitalAccount">
	<!-- 操作栏 -->
	<div class="clearfloat">
		<Button type="primary" class="right" @click='handleAdd' style="margin-right:10px;">添加新账户</Button>
	</div>
	<!-- 表格 -->
	<Table :stripe="true" :loading="tableLoading" class="table" :columns="columns" :data="tableData"></Table>
	<!-- 弹窗 -->
	<Modal v-model="dialog" class="model" width="1000" title="申请提现" :loading='formLoading' :title="formTitle" @on-ok='submit' @on-cancel='dialogClose'>
		<!-- 表单 -->
		<Form label-position="right" :rules="rule" :model='formData' ref='formData' class="clearfloat" :label-width="160">
			<div class="left" style="width:50;">
				<FormItem label="姓名：" prop='investor_name'>
					<Input class="formInput" :disabled='action==="info"' v-model="formData.investor_name"></Input>
				</FormItem>
				<FormItem label="投资人密码：" v-show='action==="add"' prop='investor_pwd'>
					<Input class="formInput" v-model="formData.investor_pwd"></Input>
				</FormItem>
				<FormItem label="佣金比例：" prop='trade_rate'>
					<Input class="formInput" :disabled='action==="info"' v-model="formData.trade_rate"></Input>
				</FormItem>
				<FormItem label="印花税：" prop='stamp_duty_rate'>
					<Input class="formInput" :disabled='action==="info"' v-model="formData.stamp_duty_rate"></Input>
				</FormItem>
				<FormItem label="是否融资融券账户：" prop='account_type'>
					<Select class="formInput" :disabled='action==="info"' v-model="formData.account_type">
						<Option :value='0'>否</Option>
						<Option :value='1'>是</Option>
					</Select>
				</FormItem>
				<FormItem label="投资人账号：" prop='investor_account'>
					<Input class="formInput" :disabled='action==="info"' v-model="formData.investor_account"></Input>
				</FormItem>
			</div>
			<div class="left" style="width:50;">
				<FormItem label="通讯密码：" prop='communication_pwd' v-show='action==="add"'>
					<Input class="formInput" v-model="formData.communication_pwd"></Input>
				</FormItem>
				<FormItem label="过户费比例：" prop='transfer_rate'>
					<Input class="formInput" :disabled='action==="info"' v-model="formData.transfer_rate"></Input>
				</FormItem>
				<FormItem label="添加时间：" v-show='action==="info"' prop='created_at'>
					<Input class="formInput" :disabled='action==="info"' v-model="formData.created_at"></Input>
				</FormItem>
				<FormItem label="交易账号：" prop='trade_account'>
					<Input class="formInput" :disabled='action==="info"' v-model="formData.trade_account"></Input>
				</FormItem>
				<FormItem label="上海股东代码：" prop='shanghai_shareholder_code'>
					<Input class="formInput" :disabled='action==="info"' v-model="formData.shanghai_shareholder_code"></Input>
				</FormItem>
				<FormItem label="深圳股东代码：" prop='shenzhen_shareholder_code'>
					<Input class="formInput" :disabled='action==="info"' v-model="formData.shenzhen_shareholder_code"></Input>
				</FormItem>
			</div>
		</Form>
	</Modal>
</div>
</template>
<script>
export default {
	name: "capitalAccount",
	data() {
		const vali = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('此项为必填'));
			} else {
				callback();
			}
		};
		return {
			action: '',
			formLoading: true,
			tableLoading: false,
			formTitle: '查看详细',
			dialog: false, // 控制弹窗
			tableData: [], // 表格数据
			columns: [{ // 表格配置项
					type: 'index',
					width: 60,
					title: "No",
					align: "center"
				},
				{
					title: '姓名',
					key: 'investor_name',
					align: 'center'
				},
				{
					title: '账户',
					key: 'investor_account',
					align: 'center',
					width: 180,
					render: (h, params) => {
						return h("div", [
							h("div", '投资账户：' + params.row.investor_account),
							h("div", '交易账户：' + params.row.trade_account),
						])
					}
				},
				{
					title: '上海股东代码',
					key: 'shanghai_shareholder_code',
					align: 'center'
				},
				{
					title: '深证股东代码',
					key: 'shenzhen_shareholder_code',
					align: 'center'
				},
				{
					title: '是否融资融券账户',
					key: 'account_type',
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", (params.row.account_type == 0) ? '否' : '是'),
						])
					}
				},
				{
					title: '账户可用资金',
					key: 'account_money',
					align: 'center'
				},
				{
					title: '排序',
					key: 'order',
					align: 'center'
				},
				{
					title: "操作",
					key: "action",
					width: 150,
					align: "center",
					render: (h, params) => {
						return h("div", [
							// 编辑
							h(
								"Button", {
									props: {
										type: "primary",
										size: "small"
									},
									style: {
										marginRight: "5px",
										marginTop: "5px",
										marginBottom: "5px"
									},
									on: {
										click: () => {
											this.handleInfo(params.row);
										}
									}
								},
								"查看详细"
							),
							h(
								"Button", {
									props: {
										type: "primary",
										size: "small"
									},
									style: {
										marginRight: "5px",
										marginTop: "5px",
										marginBottom: "5px"
									},
									on: {
										click: () => {
											this.handleEdit(params.row);
										}
									}
								},
								"修改"
							),
							h(
								"Button", {
									props: {
										type: "primary",
										size: "small"
									},
									style: {
										marginRight: "5px",
										marginTop: "5px",
										marginBottom: "5px"
									},
									on: {
										click: () => {
											this.handleUp(params.row);
										}
									}
								},
								"上移"
							),
						]);
					}
				}
			],
			formData: { // 表单数据
				account_type: '',
				id: '',
				investor_name: '',
				investor_pwd: "",
				trade_rate: "",
				stamp_duty_rate: "",
				investor_account: '',
				communication_pwd: "",
				transfer_rate: "",
				created_at: '',
				trade_account: '',
				shanghai_shareholder_code: '',
				shenzhen_shareholder_code: ''
			},
			rule: { // 表单验证
				investor_name: [{
					validator: vali,
					trigger: 'blur'
				}],
				investor_pwd: [{
					validator: vali,
					trigger: 'blur'
				}],
				trade_rate: [{
					validator: vali,
					trigger: 'blur'
				}],
				stamp_duty_rate: [{
					validator: vali,
					trigger: 'blur'
				}],
				investor_account: [{
					validator: vali,
					trigger: 'blur'
				}],
				communication_pwd: [{
					validator: vali,
					trigger: 'blur'
				}],
				transfer_rate: [{
					validator: vali,
					trigger: 'blur'
				}],
				trade_account: [{
					validator: vali,
					trigger: 'blur'
				}],
				shanghai_shareholder_code: [{
					validator: vali,
					trigger: 'blur'
				}],
				shenzhen_shareholder_code: [{
					validator: vali,
					trigger: 'blur'
				}],
			}
		}
	},
	activated() {
		this.getData()
	},
	mounted() {
		this.getData()
	},
	methods: {
		// 获取数据
		getData() {
			this.tableLoading = true
			let api = this.$api.risk.investors
			this.$axios.get(api).then(res => {
				this.tableData = res.data.data
				this.tableLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		// 操作函数
		handleInfo(row) {
			let api = this.$api.risk.investor
			this.action = 'info'
			this.$axios.get(api, {
				params: {
					id: row.id
				}
			}).then(res => {
				this.formData = res.data.data
				this.formTitle = '账户详细'
				this.dialog = true
			}).catch(err => {
				console.log(err);
			})
		},
		// 编辑
		handleEdit(row) {
			this.action = 'edit'
			let api = this.$api.risk.investor
			this.$axios.get(api, {
				params: {
					id: row.id
				}
			}).then(res => {
				this.formData = res.data.data
				this.formTitle = '编辑账户'
				this.dialog = true
			}).catch(err => {
				console.log('接口错误' + api);
			})
		},
		// 添加
		handleAdd() {
			this.handleReset('formData')
			this.dialog = true
			this.action = 'add'
		},
		// 上移
		handleUp(row) {
			let api = this.$api.risk.investor_up
			this.$Modal.confirm({
				content: '<p>上移该账户！？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.post(api, {
						id: row.id
					}).then(res => {
						this.$Message.success(res.data.message)
						this.getData()
					}).catch(err => {
						console.log('接口错误', api);
					})
				},
				onCancel: () => {
					this.$Message.info('已取消');
				}
			});
		},
		// 提交申请
		submit() {
			var api = ''
			var para = {}
			var way = ''
			if (this.action == 'add') {
				api = this.$api.risk.investor_create
				para = {
					account_type: this.formData.account_type,
					investor_name: this.formData.investor_name,
					investor_account: this.formData.investor_account,
					trade_account: this.formData.trade_account,
					investor_pwd: this.formData.investor_pwd,
					communication_pwd: this.formData.communication_pwd,
					shanghai_shareholder_code: this.formData.shanghai_shareholder_code,
					shenzhen_shareholder_code: this.formData.shenzhen_shareholder_code,
					trade_rate: this.formData.trade_rate,
					transfer_rate: this.formData.transfer_rate,
					stamp_duty_rate: this.formData.stamp_duty_rate,
				}
				way = 'post'
			} else if (this.action == 'info') {
				this.action = ''
				this.handleReset('formData')
				this.dialog = false
				return this.changeLoading();
			} else {
				api = this.$api.risk.investor_edit
				para = {
					account_type: this.formData.account_type,
					id: this.formData.id,
					investor_name: this.formData.investor_name,
					investor_account: this.formData.investor_account,
					trade_account: this.formData.trade_account,
					investor_pwd: this.formData.investor_pwd,
					communication_pwd: this.formData.communication_pwd,
					shanghai_shareholder_code: this.formData.shanghai_shareholder_code,
					shenzhen_shareholder_code: this.formData.shenzhen_shareholder_code,
					trade_rate: this.formData.trade_rate,
					transfer_rate: this.formData.transfer_rate,
					stamp_duty_rate: this.formData.stamp_duty_rate,
				}
				way = 'post'
			}
			this.$refs.formData.validate((valid) => {
				if (valid) {
					this.$axios[way](api, para).then(res => {
						this.$Message.success('success！');
						this.dialog = false
						this.getData()
						this.handleReset('formData')
						return this.changeLoading();
					}).catch(err => {
						return this.changeLoading();
						console.log('接口错误' + api);
					})
				} else {
					return this.changeLoading();
				}
			})
		},
		// 修改表单loading状态
		changeLoading() {
			this.formLoading = false;
			this.$nextTick(() => {
				this.formLoading = true;
			});
		},
		// 重置表单
		handleReset(name) {
			this.$refs[name].resetFields();
		},
		// 关闭弹窗前
		dialogClose() {
			this.dialog = false
			this.handleReset('formData')
		}
	}
}
</script>
<style scoped>
.load {
	animation: ani-demo-spin 1s linear infinite;
}

.page {
	float: right;
	margin-top: 20px;
	margin-bottom: 20px;
}

.table {
	margin-top: 20px;
}

.input {
	width: 200px;
	margin-right: 20px;
	margin-top: 20px;
}

.formInput {
	width: 200px;
}

.model span {
	color: #797979;
	display: inline-block;
	min-width: 40%;
	font-size: 14px;
	line-height: 30px;
}

.box {
	width: 50%;
}

.red {
	color: red,
}

.green {
	color: green,
}
</style>
