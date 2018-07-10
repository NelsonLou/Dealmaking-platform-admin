<template>
<div id="userList" style="position:relative">
	<!-- 用户列表 -->
	<div v-show='!showFlow' style="position:relative">
		<!-- 搜索框 -->
		<div class="clearfloat">
			<Select class="filterInput left marginRight" v-model="filter.agent_id" clearable placeholder="代理商名称" :loading='agenteSelectLoading' :label-in-value='true' filterable remote :remote-method="remoteMethodAgent">
				<Option v-for='(item, index) in agentList' :key='index' :value='item.id' :label='item.name'>{{item.name}}</Option>
			</Select>
			<!-- 身份证 -->
			<Input class="filterInput left marginRight" v-model="filter.id_card" placeholder="身份证"></Input>
			<Select class="filterInput left marginRight" clearable v-model="filter.user_id" placeholder="姓名" :loading='userSelectLoading' :label-in-value='true' filterable remote :remote-method="remoteMethodUser">
				<Option v-for='item in userList' :key='item.id' :value='item.id'>{{item.name}}</Option>
			</Select>
			<Button class="left" type='primary' @click='handleSearch(1)'>查询</Button>
			<!-- <Button class="right" type='primary'>导出</Button> -->
		</div>
		<!-- 表格 -->
		<Table class="table" id='table' :stripe="true" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
		<!-- 分页 -->
		<Page size="small" class="page" :total="total" :current='page' :page-size='limit' @on-page-size-change='handlePageSize' :page-size-opts='[10,20,30,40]' @on-change='flip' show-sizer show-elevator show-total></Page>
		<!-- 弹窗 -->
		<Modal v-model="dialog" :loading='formLoading' class="model" width="1000" :title="formTitle" @on-ok="submit">
			<!-- 编辑表单 -->
			<Form :model="editFormData" v-show='action === "edit"' :rules="ruleEdit" ref='editFormData' label-position="right" on-cancel='resetform' :label-width="100">
				<FormItem label="姓名：" prop='name'>
					<Input class="formInput" v-model="editFormData.name" :disabled="true"></Input>
				</FormItem>
				<FormItem label="手机号：" prop='mobile'>
					<Input class="formInput" v-model="editFormData.mobile" :disabled='true'></Input>
				</FormItem>
				<FormItem label="新代理商：" prop='newAgent'>
					<Select class="formInput" v-model="editFormData.newAgent" clearable placeholder="代理商名称" :label-in-value='true' filterable remote :loading='agenteSelectLoading' :remote-method="editRemoteMethodAgent">
						<Option v-for='(item, index) in editAgentList' :key='index' :value='item.id'>{{item.name}}</Option>
					</Select>
					<span>当前代理商 - {{editFormData.agent_user}}</span>
				</FormItem>
				<FormItem label="新增模拟币：" prop='simulation'>
					<Input class="formInput" v-model="editFormData.simulation"></Input>
					<span>当前模拟币：￥{{editFormData.simulation_available_balance}}</span>
				</FormItem>
			</Form>
			<!-- 实名认证表单 -->
			<Form :model="realFormData" v-show='action === "realName"' :rules="ruleReal" ref='realFormData' label-position="right" on-cancel='resetform' :label-width="100">
				<FormItem label="代理商：" prop='agent_user'>
					<Input class="formInput" v-model="realFormData.agent_user" :disabled='true'></Input>
				</FormItem>
				<FormItem label="手机号：" prop='mobile'>
					<Input class="formInput" v-model="realFormData.mobile" :disabled='true'></Input>
				</FormItem>
				<FormItem label="姓名" prop='name'>
					<Input class="formInput" v-model="realFormData.name"></Input>
				</FormItem>
				<FormItem label="身份证" prop='id_card'>
					<Input class="formInput" v-model="realFormData.id_card"></Input>
				</FormItem>
			</Form>
			<Spin fix v-if='modelLoading' siez='large'></Spin>
		</Modal>
	</div>
	<!-- 用户流水 -->
	<div v-show='showFlow'>
		<Card>
			<span>{{userName}}</span>
			<p v-if='flowType==="wallet"'>钱包流水</p>
			<p v-if='flowType==="strategy"'>策略流水</p>
		</Card>
		<Button class="marginBottom marginTop" type='primary' @click='handleFlowSearch(1)'>查询</Button>
		<Button type='primary' class="marginBottom marginTop" @click='handleBack'>返回</Button>
		<div class="clearfloat">
			<Select class="filterInput marginRight left" v-model="flowfilter.flow_type" placeholder="流水类型">
				<Option v-for='item in walletType' v-if='flowType==="wallet"' :key='item.value' :value='item.value'>{{item.label}}</Option>
				<Option v-for='item in strategyFlow' v-if='flowType==="strategy"' :key='item.value' :value='item.value'>{{item.label}}</Option>
			</Select>
			<Col span="12" class="input">
			<DatePicker type="daterange" v-model='flowfilter.time' placement="bottom-end" placeholder="充值时间" style="width: 200px"></DatePicker>
			</Col>
		</div>
		<Table class="table" :stripe="true" :loading="flowTableLoading" :columns="flowColumns" :data="flowTableData"></Table>
		<Page size="small" class="page" :total="flowTotal" :current='flowPage' :page-size='flowLimit' @on-page-size-change='handleFlowPageSize' :page-size-opts='[10,20,30,40]' @on-change='flowFlip' show-sizer show-elevator show-total></Page>
	</div>
</div>
</template>
<script>
export default {
	name: "userList",
	data() {
		return {
			flowTableLoading: false, //流水表格loading
			tableLoading: false, // 表格loading
			formLoading: true, // 表单loading
			userSelectLoading: false, // 用户搜索loading
			modelLoading: false, // 弹窗loading
			agenteSelectLoading: false, // 代理商搜索框loading
			showFlow: false, //显示流水
			dialog: false, // 控制弹窗
			page: 1, // 表格页码
			limit: 10, // 表格单页总量
			total: 1, //表格数据总量
			flowPage: 1, // 流水页码
			flowLimit: 10, // 流水单页数据量
			flowTotal: 1, // 流水数据总量
			userName: '', //流水显示用户
			formTitle: '', //表单title
			flowType: '', //流水类型验证
			action: '', // 执行操作
			agentList: [], //代理商列表
			editAgentList: [], // 表单代理商列表
			userList: [], //用户列表
			filter: { // 搜索数据
				id_card: '',
				agent_id: '',
				user_id: ''
			},
			tableData: [], // 表格数据
			editFormData: { // 编辑表单数据
				user_id: '',
				name: '',
				agent_id: '',
				mobile: '',
				newAgent: '',
				simulation_available_balance: '',
				simulation: '',
				agent_user: '',
			},
			realFormData: { //实名认证表单数据
				user_id: '',
				name: '',
				id_card: '',
				agent_user: '',
				mobile: ''
			},
			ruleEdit: {}, //编辑表单验证
			ruleReal: {}, // 实名表单验证
			columns: [{ //表格配置
					type: 'index',
					width: 60,
					title: "No",
					align: "center",
				},
				{
					title: "姓名",
					key: "name",
					align: "center",
				},
				{
					title: "昵称",
					key: "nickname",
					align: "center"
				},
				{
					title: "手机号",
					key: "mobile",
					align: "center"
				},
				{
					title: "注册时间",
					key: "created_at",
					align: "center",
					width: 150,
				},
				{
					title: "余额",
					key: "amount",
					align: "center",
					render: (h, params) => {
						return h("div", [
							h("div", '策略余额：' + params.row.available_balance),
							h("div", '钱包余额：' + params.row.wallet_amount)
						])
					}
				},
				{
					title: "保证金",
					key: "frozen_amount",
					align: "center"
				},
				{
					title: "充值金额",
					key: "total_amount",
					align: "center"
				},
				{
					title: "提现金额",
					key: "to_cash",
					align: "center",
					render: (h, params) => {
						return h("div", [
							h("div", '已提现：' + params.row.withdraw_already),
							h("div", '提现中：' + params.row.withdraw_amount)
						])
					}
				},
				{
					title: "是否绑定银行卡",
					key: "has_card",
					align: "center",
					width: 180,
					render: (h, params) => {
						return h("div", [
							h("div", params.row.bank_card_no != null ? this.handleBanckNo(params.row.bank_card_no) : '未绑定'),
						])
					}
				},
				{
					title: "代理商",
					key: "agent",
					align: "center",
					render: (h, params) => {
						return h("div", [
							h("div", params.row.agent_name),
							h("div", params.row.agent_account)
						])
					}
				},
				{
					title: "操作",
					key: "action",
					align: "center",
					width: 150,
					render: (h, params) => {
						return h("div", [
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
											this.handleWallet(params.row);
										}
									}
								},
								"钱包流水"
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
											this.handleStrategy(params.row);
										}
									}
								},
								"策略流水"
							),
							h(
								"Button", {
									props: {
										type: "warning",
										size: "small"
									},
									style: {
										display: params.row.name == '[未实名]' ? 'inline-block' : 'none',
										marginRight: "5px",
										marginTop: "5px",
										marginBottom: "5px"
									},
									on: {
										click: () => {
											this.handleRealName(params.row);
										}
									}
								},
								"实名认证"
							),
							h(
								"Button", {
									props: {
										type: "error",
										size: "small"
									},
									style: {
										marginRight: "5px",
										marginTop: "5px",
										marginBottom: "5px"
									},
									on: {
										click: () => {
											this.handleDelete(params.row);
										}
									}
								},
								"删除"
							),
						]);
					}
				}
			],
			walletType: [{ //钱包流水类型
					value: '0',
					label: '入金'
				},
				{
					value: '1',
					label: '提现'
				},
				{
					value: '10',
					label: '策略余额转入'
				},
				{
					value: '11',
					label: '策略余额转出'
				}
			],
			strategyFlow: [{ //策略流水类型
					value: '7',
					label: '扣除保证金'
				},
				{
					value: '4',
					label: '扣除递延费'
				},
				{
					value: '8',
					label: '返回保证金'
				},
				{
					value: '2',
					label: '策略盈亏'
				},
				{
					value: '6',
					label: '追加保证金'
				}
			],
			flowfilter: { //流水搜索数据
				id: '',
				flow_type: '',
				time: []
			},
			flowTableData: [], //流水表格数据
			flowColumns: [{ //流水表格配置
					type: 'index',
					width: 60,
					title: "No",
					align: "center",
				},
				{
					title: "类型",
					key: "flow_type",
					align: "center"
				},
				{
					title: "变动金额",
					key: "flow_money",
					align: "center"
				},
				{
					title: "变动时间",
					key: "created_at",
					align: "center"
				},
			],
		}
	},
	activated() {
		this.page = 1
		let para = {
			limit: this.limit,
			page: this.page,
		}
		this.getData(para)
	},
	methods: {
		// 获取数据
		getData(para) {
			this.tableLoading = true
			let api = this.$api.userManage.users
			this.tableData = []
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.tableData = res.data.items
				this.total = res.data.total
				this.tableLoading = false
			}).catch(err => {
				console.log(err)
			})
		},
		// 信息修改
		handleEdit(row) {
			this.resetform()
			this.dialog = true
			this.modelLoading = true
			this.action = 'edit'
			this.formTitle = '信息修改'
			let api = this.$api.userManage.user
			this.$axios.get(api, {
				params: {
					user_id: row.id
				}
			}).then(res => {
				this.editFormData.agent_id = (res.data.data.agent_id).toString()
				this.editFormData.agent_user = (res.data.data.agent_user == null) ? '无代理商' : res.data.data.agent_user.name
				this.editFormData.id = res.data.data.id
				this.editFormData.mobile = res.data.data.mobile
				this.editFormData.name = (res.data.data.name == null) ? '未实名' : res.data.data.name
				this.editFormData.simulation_available_balance = res.data.data.simulation_available_balance
				this.modelLoading = false
			}).catch(err => {
				console.log(err)
			})
		},
		// 实名认证
		handleRealName(row) {
			this.modelLoading = true
			this.action = 'realName'
			this.formTitle = '实名认证'
			this.dialog = true
			let api = this.$api.userManage.user
			this.$axios.get(api, {
				params: {
					user_id: row.id
				}
			}).then(res => {
				this.realFormData.name = res.data.data.name == null ? '' : res.data.data.name
				this.realFormData.user_id = res.data.data.id
				this.realFormData.agent_user = res.data.data.agent_user == null ? '' : res.data.data.agent_user.name
				this.realFormData.mobile = res.data.data.mobile == null ? '' : res.data.data.mobile
				this.modelLoading = false
			}).catch(err => {
				console.log(err)
			})
		},
		// 删除
		handleDelete(row) {
			let api = this.$api.userManage.users_destroy
			this.$Modal.confirm({
				title: '删除用户',
				content: '<p>确认删除该用户？！</p>',
				onOk: () => {
					this.$axios.post(api, {
						user_id: row.id
					}).then(res => {
						this.$Message.success(res.data.message)
						let para = {
							page: this.page,
							limit: this.limit
						}
						this.getData(para)
					}).catch(err => {
						console.log('接口错误', api);
					})
				},
				onCancel: () => {
					this.$Message.info('取消删除');
				}
			});
		},
		// 修改页大小
		handlePageSize(size) {
			this.limit = size
			this.handleSearch(1)
		},
		// 搜索
		handleSearch(count) {
			if (count == 1) {
				this.page = 1
			}
			let para = {
				limit: this.limit,
				page: this.page,
				id_card: this.filter.id_card,
				agent_id: this.filter.agent_id,
				user_id: this.filter.user_id
			}
			this.getData(para)
		},
		// 钱包流水
		handleWallet(row) {
			this.showFlow = true
			this.flowType = 'wallet'
			this.flowPage = 1
			this.flowfilter.id = row.id
			let para = {
				user_id: row.id,
				limit: this.flowLimit,
				page: this.flowPage
			}
			this.userName = row.name
			this.getFlowData(para)
		},
		// 策略流水
		handleStrategy(row) {
			this.showFlow = true
			this.flowType = 'strategy'
			this.flowPage = 1
			this.flowfilter.id = row.id
			let para = {
				user_id: row.id,
				limit: this.flowLimit,
				page: this.flowPage
			}
			this.userName = row.name
			this.getFlowData(para)
		},
		// 翻页
		flip(page) {
			this.page = page
			this.handleSearch(0)
		},
		// 提交表单
		submit() {
			let formName = ''
			let api = ''
			let para = {}
			if (this.action == 'edit') {
				formName = 'editFormData'
				api = this.$api.userManage.users_edit
				para = {
					user_id: this.editFormData.id,
					simulation: this.editFormData.simulation,
					agent_id: this.editFormData.newAgent
				}
			} else {
				formName = 'realFormData'
				api = this.$api.userManage.users_certification
				para = {
					user_id: this.realFormData.user_id,
					name: this.realFormData.name,
					id_card: this.realFormData.id_card,
				}
			}
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$axios.post(api, para).then(res => {
						this.$Message.success(res.data.message);
						this.dialog = false
						this.resetform()
						this.handleSearch(0)
					}).catch(err => {
						console.log('接口错误', api);
					})
				} else {
					return this.changeLoading();
				}
				setTimeout(() => {
					this.changeLoading();
				}, 1000);
			})
		},
		// 重置表单
		resetform() {
			this.$refs.editFormData.resetFields();
			this.$refs.realFormData.resetFields();
		},
		// 用户远程搜索
		remoteMethodUser(query) {
			if (query == '') {
				this.userList = []
			} else {
				this.userSelectLoading = true
				this.userList = []
				let api = this.$api.common.select_user
				this.$axios.get(api, {
					params: {
						user_param: query
					}
				}).then(res => {
					this.userList = []
					for (let i in res.data) {
						this.userList.push({
							id: (res.data[i].id).toString(),
							name: (res.data[i].name == null) ? (res.data[i].mobile) : (res.data[i].name)
						})
					}
					this.userSelectLoading = false
				}).catch(err => {
					console.log(err)
				})
			}
		},
		// 代理商远程搜索
		remoteMethodAgent(query) {
			if (query == '') {
				this.agentList = []
			} else {
				this.agenteSelectLoading = true
				this.agentList = []
				let api = this.$api.common.select_agent
				this.$axios.get(api, {
					params: {
						agent_param: query
					}
				}).then(res => {
					this.agentList = res.data
					for (let i in this.agentList) {
						this.agentList[i].id = (this.agentList[i].id).toString()
					}
					this.agenteSelectLoading = false
				}).catch(err => {
					console.log(err)
				})
			}
		},
		// 表单代理商远程搜索
		editRemoteMethodAgent(query) {
			if (query == '') {
				this.editAgentList = []
			} else {
				this.agenteSelectLoading = true
				this.editAgentList = []
				let api = this.$api.common.select_agent
				this.$axios.get(api, {
					params: {
						agent_param: query
					}
				}).then(res => {
					this.editAgentList = res.data
					for (let i in this.editAgentList) {
						this.editAgentList[i].id = (this.editAgentList[i].id).toString()
					}
					this.agenteSelectLoading = false
				}).catch(err => {
					console.log(err)
				})
			}
		},
		// 修改表单loading状态
		changeLoading() {
			this.formLoading = false;
			this.$nextTick(() => {
				this.formLoading = true;
			});
		},
		// 返回
		handleBack() {
			this.showFlow = false
			this.flowType = ''
			this.flowfilter = {
				id: '',
				flow_type: '',
				time: []
			}
			this.getData(this.filter)
		},
		// 银行卡显示修改
		handleBanckNo(no) {
			let start = no.substring(0, 3)
			let end = no.substring(no.length - 4, no.length)
			let center = ''
			for (let i = 0; i < no.length - 8; i++) {
				center = center + '*'
			}
			return start + center + end
		},
		// 流水部分方法======================
		// 获取流水数据
		getFlowData(para) {
			this.flowTableLoading = true
			let api = ''
			if (this.flowType == 'wallet') {
				api = this.$api.userManage.users_cash_flow
			} else {
				api = this.$api.userManage.users_policy_flow
			}
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.flowTableData = []
				var data = res.data.items
				if (data.length > 0) {
					for (let i = 0; i < data.length; i++) {
						if (this.flowType == 'strategy') {
							for (let y in this.strategyFlow) {
								if (this.strategyFlow[y].value == data[i].flow_type) {
									data[i].flow_type = this.strategyFlow[y].label
								}
							}
						} else {
							for (let y in this.walletType) {
								if (this.walletType[y].value == data[i].flow_type) {
									data[i].flow_type = this.walletType[y].label
								}
							}
						}
						this.flowTableData = data
					}
				}
				this.flowTotal = res.data.total
				this.flowTableLoading = false
			}).catch(err => {
				console.log('接口错误', api);
				console.log(err);
			})
		},
		// 修改流水页大小
		handleFlowPageSize(size) {
			this.flowLimit = size
			this.handleFlowSearch(1)
		},
		// 流水搜索
		handleFlowSearch(count) {
			var end_time = ''
			var start_time = ''
			if (this.flowfilter.time.length > 1) {
				if (this.flowfilter.time[0] != '') {
					start_time = this.handletimer(this.flowfilter.time[0])
				}
				if (this.flowfilter.time[1] != '') {
					end_time = this.handletimer(this.flowfilter.time[1])
				}
			}
			if (count == 1) {
				this.flowPage = 1
			}
			let para = {
				limit: this.flowLimit,
				page: this.flowPage,
				user_id: this.flowfilter.id,
				start_time: start_time,
				end_time: end_time
			}
			if (this.flowfilter.flow_type == '') {
				this.getFlowData(para)
			} else {
				para.flow_type = this.flowfilter.flow_type
				this.getFlowData(para)
			}
		},
		// 流水翻页
		flowFlip(page) {
			this.flowPage = page
			this.handleFlowSearch(0)
		},
		// 时间戳处理
		handletimer(date) {
			let eyear = date.getFullYear()
			let emonth = Number(date.getMonth()) + 1
			let eday = date.getDate()
			let ehours = date.getHours()
			let eminutes = date.getMinutes()
			let esecond = date.getSeconds()
			return eyear + '-' + emonth + '-' + eday + ' ' + ehours + ':' + eminutes + ':' + esecond
		},
	}
}
</script>
<style scoped>
.table {
	margin-top: 20px;
}

.page {
	float: right;
	margin-top: 20px;
	margin-bottom: 20px;
}
</style>
