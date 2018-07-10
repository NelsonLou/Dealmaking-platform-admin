<!-- 结算记录 -->
<template>
<div id="settledRecord">
	<div class="" v-if='!showInfo'>
		<!-- 操作栏 -->
		<div class="clearfloat">
			<Button class="left" @click='handleSearch' type='primary'>查询</Button>
			<Button class="right" @click='handleExport' type='primary'>导出</Button>
		</div>
		<!-- 搜索框 -->
		<div class="clearfloat marginTop">
			<DatePicker class="input left" type="daterange" placeholder="开始/结束日期" v-model='filter.time' style="width: 300px"></DatePicker>
			<Select class="input left" v-model="filter.agent_id" clearable placeholder="代理商名称" :loading='agentLoading' :label-in-value='true' filterable remote :remote-method="remoteMethodAgent">
				<Option v-for='item in agentList' :key='item.id' :value='item.id'>{{item.name}}</Option>
			</Select>
		</div>
		<!-- 表格 -->
		<Table class="table" :stripe="true" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
		<!-- 分页 -->
		<Page size="small" class="page" :total="total" :current='page' @on-change='flip' show-elevator show-total></Page>
	</div>
	<!-- 详细 -->
	<div class="" v-else>
		<!-- 操作栏 -->
		<div class="clearfloat">
			<Button class="left marginRight" @click='handleBack' type='primary'>返回</Button>
			<Button class="left" @click='handleSearch' type='primary'>查询</Button>
			<Button class="right" @click='handleExport' type='primary'>导出</Button>
		</div>
		<!-- 搜索框 -->
		<div class="clearfloat marginTop">
			<DatePicker type="date" class="input left" style="width: 200px" placeholder='日期' v-model='filter.time'></DatePicker>
			<Select class="input left" v-model="filter.agent_id" clearable placeholder="代理商" :label-in-value='true' filterable remote :remote-method="remoteMethodAgent">
				<Option v-for='item in agentList' :key='item.id' :value='item.id'>{{item.name}}</Option>
			</Select>
		</div>
		<!-- 表格 -->
		<Table class="table" :stripe="true" :loading="infoTableLoading" :columns="infoColumns" :data="infoTableData"></Table>
		<!-- 分页 -->
		<Page size="small" class="page" :total="total" :current='page' @on-change='flip' show-elevator show-total></Page>
	</div>
</div>
</template>
<script>
export default {
	name: "settledRecord",
	data() {
		return {
			showInfo: false,
			agentList: [],
			userList: [],
			tableLoading: false,
			infoTableLoading: false,
			agentLoading: false,
			tableData: [],
			infoTableData: [],
			page: 1,
			total: 1,
			limit: 50,
			infoPage: 1,
			infoTotal: 1,
			infoLimit: 50,
			filter: {
				time: '',
				agent_id: '',
			},
			columns: [{
					title: "结算日期",
					key: "settlement_date",
					align: "center",
					width: 150,
				},
				{
					title: "买入佣金",
					key: "buy_commission_share_amount",
					align: "center",
				},
				{
					title: "卖出佣金",
					key: "sell_commission_share_amount",
					align: "center",
				},
				{
					title: "买入过户费",
					key: "buy_transfer_fee_share_amount",
					align: "center",
				},
				{
					title: "卖出过户费",
					key: "sell_transfer_fee_share_amount",
					align: "center"
				},
				{
					title: "印花税",
					key: "stamp_duty_share_amount",
					align: "center"
				},
				{
					title: "递延费总额",
					key: "deferred_charge_share_amount",
					align: "center"
				},
				{
					title: "总收入",
					key: "total_share_amount",
					align: "center"
				},
				{
					title: "代理商",
					key: "agent_name",
					align: "center",
					render: (h, params) => {
						return h("div", [
							h("div", params.row.agent_name),
							h("div", '点数（%）' + params.row.agent_point),
						])
					}
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
											this.handleInfo(params.row);
										}
									}
								},
								"查看详细"
							)
						]);
					}
				}
			],
			infoColumns: [{
					title: "策略编号",
					key: "agent_name",
					align: "center",
				},
				{
					title: "姓名",
					key: "order_number",
					align: "center",
				},
				{
					title: "买入/卖出时间",
					key: "bankcard_number",
					align: "center",
				},
				{
					title: "买入佣金",
					key: "created_at",
					align: "center",
				},
				{
					title: "卖出佣金",
					key: "status",
					align: "center"
				},
				{
					title: "买入过户费",
					key: "withdraw_amount",
					align: "center"
				},
				{
					title: "卖出过户费",
					key: "bank_charges",
					align: "center"
				},
				{
					title: "印花税",
					key: "bank_charges",
					align: "center"
				},
				{
					title: "递延费总额",
					key: "bank_charges",
					align: "center"
				},
				{
					title: "盈利分成",
					key: "bank_charges",
					align: "center"
				},
				{
					title: "总收入",
					key: "bank_charges",
					align: "center"
				},
				{
					title: "点数",
					key: "bank_charges",
					align: "center"
				},
				{
					title: "代理商",
					key: "bank_charges",
					align: "center",
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
	},
	methods: {
		// 获取数据
		getData(para) {
			this.tableLoading = true
			let api = this.$api.capital.agent_statement_records
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
		// 获取数据
		getInfoData(para) {
			this.infoTableLoading = true
			let api = this.$api.capital.agent_statement_records
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.infoTableData = []
				for (let i = 0; i < res.data.items.length; i++) {
					this.infoTableData.push({
						id: res.data.items[i].id,
						buy_commission_share_amount: res.data.items[i].buy_commission_share_amount,
						sell_commission_share_amount: res.data.items[i].sell_commission_share_amount,
						buy_transfer_fee_share_amount: res.data.items[i].buy_transfer_fee_share_amount,
						sell_transfer_fee_share_amount: res.data.items[i].sell_transfer_fee_share_amount,
						stamp_duty_share_amount: res.data.items[i].stamp_duty_share_amount,
						deferred_charge_share_amount: res.data.items[i].deferred_charge_share_amount,
						total_share_amount: res.data.items[i].total_share_amount,
						agent_id: res.data.items[i].agent_id,
						agent_name: res.data.items[i].agent_name,
						agent_account: res.data.items[i].agent_account,
						agent_point: res.data.items[i].agent_point,
					})
				}
				this.total = res.data.total
				this.infoTableLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		// 翻页
		flip(page) {
			if (this.showInfo) {
				this.infoPage = page
				this.handleSearchInfo('flip')
			} else {
				this.page = page
				this.handleSearch('flip')
			}
		},
		// 修改页大小
		handlePageSize(size) {
			if (this.showInfo) {
				this.infoLimit = size
				this.handleSearchInfo()
			} else {
				this.limit = size
				this.handleSearch()
			}
		},
		// 详细
		handleInfo(row) {
			this.showInfo = true
			this.infoPage = 1
			this.infoLimit = 10
			let para = {
				page: this.infoPage,
				limit: this.infoLimit
			}
			this.getInfoData(para)
		},
		// 搜索
		handleSearch(status) {
			var start_time = ''
			var end_time = ''
			if (this.filter.time[0].length != '') {
				start_time = this.handletimer(this.filter.time[0])
			}
			if (this.filter.time[1].length != '') {
				end_time = this.handletimer(this.filter.time[1])
			}
			if (status != 'flip') {
				this.page = 1
			}
			let para = {
				agent_id: this.filter.agent_id,
				start_time: start_time,
				end_time: end_time,
				page: this.page,
				limit: this.limit
			}
			this.getData(para)
		},
		// 搜索
		handleSearchInfo() {
			var time = ''
			if (this.filter.date.length > 0) {
				time = this.handletimer(this.filter.date)
			}
			if (status != 'flip') {
				this.page = 1
			}
			let para = {
				agent_id: this.filter.agent_id,
				time: time,
				page: this.page,
				limit: this.limit
			}
			this.getInfoData(para)
		},
		// 导出
		handleExport() {},
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
		// 返回
		handleBack() {
			this.showInfo = false
			this.page = 1
			let para = {
				page: this.page,
				limit: this.limit
			}
			this.getData(para)
		}
	}
}
</script>
<style scoped>
.input {
	width: 200px;
	margin-right: 20px;
}

.table {
	margin-top: 20px;
}

.page {
	margin-top: 20px;
	margin-bottom: 20px;
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
