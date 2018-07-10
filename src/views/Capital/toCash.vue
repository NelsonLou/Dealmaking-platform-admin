<!-- 提现列表 -->
<template>
<div id="toCash" style="position:relative">
	<div class="clearfloat">
		<Button type="primary" class="left" @click='handleSearch(1)'>查询</Button>
		<Button type="primary" class="right" @click='handleExport'>导出</Button>
	</div>
	<div class="clearfloat">
		<Select class="input left" v-model="filter.user_id" clearable placeholder="策略人" :loading='userLoading' :label-in-value='true' filterable remote :remote-method="remoteMethodUser">
			<Option v-for='item in userList' :key='item.id' :value='item.id'>{{item.name}}</Option>
		</Select>
		<Select class="input left" v-model="filter.agent_account" clearable placeholder="代理商" :loading='agentLoading' :label-in-value='true' filterable remote :remote-method="remoteMethodAgent">
			<Option v-for='item in agentList' :key='item.account' :value='item.account'>{{item.name}}</Option>
		</Select>
		<Select class="input left" v-model="filter.status" clearable placeholder="提现状态">
			<Option v-for="(item,index) in statusList" :value="index" :key="index">{{item}}</Option>
		</Select>
		<Input class="input left" v-model="filter.withdraw_no" placeholder="提现单号"></Input>
		<Col span="12" class="input">
		<DatePicker type="daterange" v-model='filter.time' placement="bottom-end" placeholder="充值时间" style="width: 200px"></DatePicker>
		</Col>
	</div>
	<Table :stripe="true" :loading="tableLoading" class="table" :columns="columns" :data="tableData"></Table>
	<Page size="small" class="page" :total="total" :current='page' :page-size='limit' @on-page-size-change='handlePageSize' :page-size-opts='[10,20,30,40]' @on-change='flip' show-sizer show-elevator show-total></Page>
	<!-- 弹窗 -->
	<Modal v-model="dialog" :loading='formLoading' ok-text='去申请' class="model" width="1000" @on-ok='submit' title="申请提现">
		<!-- 编辑表单 -->
		<Form label-position="right" class="clearfloat" :label-width="150">
			<div>
				<h3>审核结果</h3>
			</div>
			<div class="left box">
				<FormItem label="累计充值金额：">
					<span>{{formData.order_money}}</span>
				</FormItem>
				<FormItem label="提现中金额：">
					<span>{{formData.on_withdraw_money}}</span>
				</FormItem>
				<FormItem label="钱包余额：">
					<span>{{formData.wallet_money}}</span>
				</FormItem>
				<FormItem label="冻结保证金：">
					<span>{{formData.frozen_money}}</span>
				</FormItem>
				<FormItem label="审核结果：">
					<span style="color:red" v-if='formData.result===0'>不通过</span>
					<span style="color:green" v-if='formData.result===1'>通过</span>
				</FormItem>
			</div>
			<div class="left box">
				<FormItem label="策略余额：">
					<span>{{formData.available_money}}</span>
				</FormItem>
				<FormItem label="盈亏总额：">
					<span>{{formData.profit_money}}</span>
				</FormItem>
				<FormItem label="累计已提现金额：">
					<span>{{formData.withdraw_money}}</span>
				</FormItem>
				<FormItem label="当前持仓扣除：">
					<span>{{formData.hold_profit_money}}</span>
				</FormItem>
				<FormItem label="金额差：">
					<span>{{formData.dif_money}}</span>
				</FormItem>
			</div>
			<div class="left" style="width:100%;">
				<h3>提现信息</h3>
			</div>
			<div class="clearfloat">
				<FormItem label="姓名：" style="marginTop:20px;">
					<span>{{formData.name}}</span>
				</FormItem>
				<FormItem label="提现单号：">
					<span>{{formData.withdraw_no}}</span>
				</FormItem>
				<FormItem label="申请提现金额：">
					<span>{{formData.money}}</span>
				</FormItem>
				<FormItem label="银行名称：">
					<span>{{formData.bank}}</span>
				</FormItem>
				<FormItem label="银行卡号：">
					<span>{{formData.bank_card_no}}</span>
				</FormItem>
			</div>
		</Form>
		<Spin fix v-if='modelLoading' size='large'></Spin>
	</Modal>
</div>
</template>
<script>
export default {
	name: "toCash",
	data() {
		return {
			limit: 10,
			page: 1,
			total: 1,
			modelLoading: false,
			tableLoading: false,
			userLoading: false,
			formLoading: true,
			agentLoading: false,
			dialog: false,
			columns: [{
					type: 'index',
					width: 60,
					title: "No",
					align: "center"
				},
				{
					title: '姓名',
					key: 'user_name',
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", params.row.user.name),
						])
					}
				},
				{
					title: '代理商',
					key: 'agent_name',
					align: 'center',
					width: 100,
					render: (h, params) => {
						return h("div", [
							h("div", params.row.agent == null ? '' : params.row.agent.name),
							h("div", params.row.agent == null ? '' : params.row.agent.account),
						])
					}
				},
				{
					title: '提现单号',
					key: 'withdraw_no',
					width: 150,
					align: 'center'
				},
				{
					title: '银行卡',
					key: 'bank_card_no',
					align: 'center',
					width: 150,
					render: (h, params) => {
						return h("div", [
							h("div", params.row.bank_card == null ? '' : params.row.bank_card.bank_name),
							h("div", params.row.bank_card == null ? '' : params.row.bank_card.bank_card_no),
						])
					}
				},
				{
					title: '提现时间',
					key: 'created_at',
					width: 150,
					align: 'center'
				},
				{
					title: '提现状态',
					key: 'status_name',
					align: 'center',
				},
				{
					title: '提现金额',
					key: 'money',
					align: 'center'
				},
				{
					title: '手续费',
					key: 'fee',
					align: 'center'
				},
				{
					title: '备注',
					key: 'comment',
					align: 'center'
				},
				{
					title: "操作",
					key: "action",
					width: 150,
					align: "center",
					render: (h, params) => {
						return h("div", [
							// 待处理
							h(
								"Button", {
									props: {
										type: "primary",
										size: "small"
									},
									style: {
										display: params.row.status == 1 ? 'block' : 'none',
										marginRight: "5px",
										marginTop: "5px",
										marginBottom: "5px"
									},
									on: {
										click: () => {
											this.handleCash(params.row);
										}
									}
								},
								"申请提现"
							),
							// 申请中
							h(
								"Button", {
									props: {
										type: "primary",
										size: "small"
									},
									style: {
										display: ((params.row.status == 2) || (params.row.status == 1)) ? 'block' : 'none',
										marginRight: "5px",
										marginTop: "5px",
										marginBottom: "5px"
									},
									on: {
										click: () => {
											this.handleCashFail(params.row);
										}
									}
								},
								"提现失败处理"
							),
							// 申请中
							h(
								"Button", {
									props: {
										type: "primary",
										size: "small"
									},
									style: {
										display: params.row.status == 2 ? 'block' : 'none',
										marginRight: "5px",
										marginTop: "5px",
										marginBottom: "5px"
									},
									on: {
										click: () => {
											this.handleCash(params.row);
										}
									}
								},
								"重新提现"
							),
						]);
					}
				}
			],
			filter: {
				withdraw_no: '',
				status: '',
				time: [],
				user_id: '',
				agent_account: ''
			},
			userList: [],
			agentList: [],
			statusList: [],
			withdraw_status: [],
			tableData: [],
			formData: {
				agent_account: "",
				agent_balance: "",
				agent_name: "",
				agent_total_income: "",
				agent_withdrawed: "",
				agent_withdrawing: "",
				bank: "",
				bankcard_number: "",
				id: "",
				order_number: "",
				withdraw_amount: "",
				difference: '',
				result: ''
			},
		}
	},
	activated() {
		this.getStatus()
	},
	methods: {
		// 获取数据
		getData(para) {
			this.tableLoading = true
			let api = this.$api.capital.user_withdraw_records
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.tableData = res.data.items
				this.total = res.data.total
				this.tableLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		// 获取提现状态
		getStatus() {
			this.tableLoading = true
			let api = this.$api.capital.withdraw_status
			this.$axios.get(api).then(res => {
				this.statusList = res.data
				this.page = 1
				let para = {
					page: this.page,
					limit: this.limit,
				}
				this.getData(para)
			}).catch(err => {
				console.log(err)
			})
		},
		// 翻页
		flip(page) {
			this.page = page
			this.handleSearch(0)
		},
		// 提现
		handleCash(row) {
			this.modelLoading = true
			this.dialog = true
			let api = this.$api.capital.user_withdraw_record
			let para = {
				id: row.id
			}
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.formData = Object.assign({
						id: res.data.id
					},
					res.data.verify, res.data.withdraw);
				this.modelLoading = false
			}).catch(err => {
				console.log('接口错误', api);
				console.log(err);
			})
		},
		// 提现失败处理
		handleCashFail(row) {
			let api = this.$api.capital.user_withdraw_unpass
			this.$Modal.confirm({
				content: '<p style="font-size: 16px;">确认取消汇款！？(操作不可撤回)</p><p style="font-size: 9px;">(确认取消后，用户提现金额将返还至用户钱包)</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.post(api, {
						id: row.id
					}).then(res => {
						this.$Message.success(res.data.message)
						this.handleSearch()
					}).catch(err => {
						console.log('接口错误', api);
					})
				},
				onCancel: () => {
					this.$Message.info('已取消');
				}
			});
		},
		// 查询
		handleSearch(count) {
			var start_time = ''
			var end_time = ''
			if (this.filter.time[0].length != '') {
				start_time = this.handletimer(this.filter.time[0])
			}
			if (this.filter.time[1].length != '') {
				end_time = this.handletimer(this.filter.time[1])
			}
			if (count == 1) {
				this.page = 1
			}
			let para = {
				withdraw_no: this.filter.withdraw_no,
				status: this.filter.status,
				end_time: end_time,
				start_time: start_time,
				user_id: this.filter.user_id,
				agent_account: this.filter.agent_account,
				limit: this.limit,
				page: this.page
			}
			this.getData(para)
		},
		// 导出
		handleExport() {
			let api = this.$api.common.export_user_withdraw_records
			this.$Modal.confirm({
				content: '<p>确认导出为excel文件？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.get(api, {
						responseType: 'blob'
					}).then(res => {
						let fileName = new Date() + 'toCash.xlsx'
						this.$jsfiledownload(res.data, fileName);
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.info('已取消');
				}
			});
		},
		// 时间戳处理
		handletimer(date) {
			console.log(date);
			let eyear = date.getFullYear()
			let emonth = Number(date.getMonth()) + 1
			let eday = date.getDate()
			let ehours = date.getHours()
			let eminutes = date.getMinutes()
			let esecond = date.getSeconds()
			return eyear + '-' + emonth + '-' + eday + ' ' + ehours + ':' + eminutes + ':' + esecond
		},
		// 用户远程搜索
		remoteMethodUser(query) {
			if (query == '') {
				this.userList = []
			} else {
				this.userLoading = true
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
							name: res.data[i].name == null ? res.data[i].mobile : res.data[i].name
						})
					}
					this.userLoading = false
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
				this.agentLoading = true
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
					this.agentLoading = false
				}).catch(err => {
					console.log(err)
				})
			}
		},
		// 修改页面数据量
		handlePageSize(size) {
			this.limit = size
			this.handleSearch(1)
		},
		// 提交申请
		submit() {
			let api = this.$api.capital.user_withdraw_pass
			let para = {
				id: this.formData.id
			}
			this.$axios.post(api, para).then(res => {
				this.$Message.success(res.data.message)
				this.dialog = false
			}).catch(err => {
				console.log(err);
			})
		},
		// 改变loading状态
		changeLoading() {
			this.formLoading = false;
			this.$nextTick(() => {
				this.formLoading = true;
			});
		},
	}
}
</script>
<style scoped>
.tips {
	font-size: 9px;
	color: #e9eaec;
}

.load {
	animation: ani-demo-spin 1s linear infinite;
}

.table {
	margin-top: 20px;
}

.input {
	width: 200px;
	margin-right: 20px;
	margin-top: 20px;
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
