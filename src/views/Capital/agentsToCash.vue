<!-- 代理商提现列表 -->
<template>
<div id="agentsToCash">
	<!-- 操作栏 -->
	<div class="clearfloat">
		<Button class="left" @click='handleSearch' type='primary'>查询</Button>
		<Button class="right" @click='handleExport' type='primary'>导出</Button>
	</div>
	<!-- 搜索框 -->
	<div class="clearfloat marginTop">
		<DatePicker class="input left" type="datetimerange" placeholder="提现时间" v-model='filter.time' style="width: 300px"></DatePicker>
		<Input class="input left" v-model="filter.order_number" placeholder="提现单号"></Input>
		<Select class="input left" v-model="filter.agent_id" clearable placeholder="代理商名称" :loading='agentLoading' :label-in-value='true' filterable remote :remote-method="remoteMethodAgent">
			<Option v-for='item in agentList' :key='item.id' :value='item.id'>{{item.name}}</Option>
		</Select>
		<Select class="input left" v-model="filter.status" clearable placeholder="提现状态">
			<Option v-for='item in withdraw_status' :key='item.value' :value='item.value'>{{item.label}}</Option>
		</Select>
	</div>
	<!-- 表格 -->
	<Table class="table" :stripe="true" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
	<!-- 分页 -->
	<Page size="small" class="page" :total="total" :current='page' @on-change='flip' show-elevator show-total></Page>
	<!-- 弹窗 -->
	<Modal v-model="dialog" class="model" width="1000" title="申请提现">
		<!-- 编辑表单 -->
		<Form label-position="right" class="clearfloat" :label-width="100">
			<div>
				<h3>审核结果</h3>
			</div>
			<div class="left box">
				<FormItem label="累计充值金额：">
					<span>{{formData.agent_total_income}}</span>
				</FormItem>
				<FormItem label="提现中金额：">
					<span>{{formData.agent_withdrawed}}</span>
				</FormItem>
				<FormItem label="审核结果：">
					<span style="color:red" v-if='formData.result==="不通过"'>{{formData.result}}</span>
					<span style="color:green" v-if='formData.result==="通过"'>{{formData.result}}</span>
				</FormItem>
			</div>
			<div class="left box">
				<FormItem label="提现中：">
					<span>{{formData.agent_withdrawing}}</span>
				</FormItem>
				<FormItem label="账户余额：">
					<span>{{formData.agent_balance}}</span>
				</FormItem>
				<FormItem label="余额差：">
					<span>{{formData.difference}}</span>
				</FormItem>
			</div>
			<div class="left" style="width:100%;">
				<h3>提现信息</h3>
			</div>
			<div class="clearfloat">
				<FormItem label="代理商：" style="marginTop:20px;">
					<span>admin</span>
				</FormItem>
				<FormItem label="提现单号：">
					<span>{{formData.order_number}}</span>
				</FormItem>
				<FormItem label="申请提现金额：">
					<span>{{formData.withdraw_amount}}</span>
				</FormItem>
				<FormItem label="银行名称：">
					<span>{{formData.bank}}</span>
				</FormItem>
				<FormItem label="银行卡号：">
					<span>{{formData.bankcard_number}}</span>
				</FormItem>
			</div>
		</Form>
		<div slot="footer">
			<Button type="primary" :loading="btnLoding" size="large" @click="submit">去申请</Button>
		</div>
	</Modal>
</div>
</template>
<script>
export default {
	name: "agentsToCash",
	data() {
		return {
			agentList: [],
			tableLoading: false,
			agentLoading: false,
			tableData: [],
			btnLoding: true,
			dialog: false,
			page: 1,
			total: 1,
			limit: 10,
			withdraw_status: [],
			formData: {
				agent_account: "",
				agent_balance: "",
				agent_id: '',
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
			filter: {
				time: '',
				agent_id: '',
				order_number: '',
				status: ''
			},
			columns: [{
					type: 'index',
					title: "No",
					width: 60,
					align: "center"
				},
				{
					title: "代理商",
					key: "agent_name",
					align: "center",
				},
				{
					title: "提现单号",
					key: "order_number",
					align: "center",
				},
				{
					title: "银行卡",
					key: "bankcard_number",
					align: "center",
				},
				{
					title: "提现时间",
					key: "created_at",
					align: "center",
				},
				{
					title: "提现状态",
					key: "status",
					align: "center"
				},
				{
					title: "提现金额",
					key: "withdraw_amount",
					align: "center"
				},
				{
					title: "手续费",
					key: "bank_charges",
					align: "center"
				},
				{
					title: "操作",
					key: "action",
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
											this.handleCash(params.row);
										}
									}
								},
								"申请提现"
							)
						]);
					}
				}
			],
		}
	},
	activated() {
		this.page = 1
		let para = {
			page: this.page,
			limit: this.limit
		}
		this.getData(para)
		this.getWithdrawStatus()
	},
	methods: {
		// 获取数据
		getData(para) {
			this.tableLoading = true
			let api = this.$api.capital.agent_withdraw_records
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.tableData = []
				for (let i = 0; i < res.data.items.length; i++) {
					var status = '未知'
					for (let j = 0; j < this.withdraw_status.length; j++) {
						if (res.data.items[i].status == this.withdraw_status[j].value) {
							status = this.withdraw_status[j].label
						}
					}
					this.tableData.push({
						id: res.data.items[i].id,
						agent_id: res.data.items[i].agent_id,
						agent_name: res.data.items[i].agent,
						order_number: res.data.items[i].order_number,
						bank: res.data.items[i].bank,
						created_at: res.data.items[i].created_at,
						status: status,
						withdraw_amount: res.data.items[i].withdraw_amount,
						bank_charges: res.data.items[i].bank_charges,
						total_share_amount: res.data.items[i].total_share_amount,
					})
				}
				this.total = res.data.total
				this.tableLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		// 翻页
		flip(page) {
			this.page = page
			this.handleSearch()
		},
		// 修改大小
		handlePageSize(size) {
			this.limit = size
			this.handleSearch()
		},
		// 搜索
		handleSearch() {
			var start_time = ''
			var end_time = ''
			if (this.filter.time[0] != '') {
				start_time = this.handletimer(this.filter.time[0])
			}
			if (this.filter.time[1] != '') {
				end_time = this.handletimer(this.filter.time[1])
			}
			this.page = 1
			let para = {
				status: this.filter.status,
				agent_id: this.filter.agent_id,
				start_time: start_time,
				end_time: end_time,
				page: this.page,
				limit: this.limit
			}
			this.getData(para)
		},
		// 申请提现
		handleCash(row) {
			this.btnLoding = true
			let api = this.$api.capital.agent_withdraw_record
			let para = {
				id: row.id
			}
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.formData = {
					agent_account: res.data.data.agent_account,
					agent_balance: res.data.data.agent_balance,
					agent_id: res.data.data.agent_id,
					agent_name: res.data.data.agent_name,
					agent_total_income: res.data.data.agent_total_income,
					agent_withdrawed: res.data.data.agent_withdrawed,
					agent_withdrawing: res.data.data.agent_withdrawing,
					bank: res.data.data.bank,
					bankcard_number: res.data.data.bankcard_number,
					id: res.data.data.id,
					order_number: res.data.data.order_number,
					withdraw_amount: res.data.data.withdraw_amount,
					difference: Number(res.data.data.agent_total_income) - Number(res.data.data.agent_withdrawed),
					result: '',
				}
				this.btnLoding = false
				this.formData.result = this.formData.difference < 0 ? '不通过' : '通过'
				this.dialog = true
			}).catch(err => {
				console.log(err)
			})
		},
		// 导出
		handleExport() {},
		// 交互
		submit() {},
		// 获取提现状态
		getWithdrawStatus() {
			let api = this.$api.capital.withdraw_status
			this.$axios.get(api).then(res => {
				for (let i in res.data) {
					this.withdraw_status.push({
						value: i,
						label: res.data[i]
					})
				}
			}).catch(err => {
				console.log(err)
			})
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
	}
}
</script>
<style scoped>
.input {
	width: 200px;
	margin-right: 20px;
}

.box {
	width: 50%;
}
</style>
