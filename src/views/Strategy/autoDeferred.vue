<!-- 自动递延 -->
<template>
<div id="autoDeferred" style="position:relative">
	<div class="clearfloat">
		<Button type="primary" class="left" @click='handleSearch(1)'>查询</Button>
		<!-- <Button type="primary" class="right" @click='handleExport'>导出</Button> -->
	</div>
	<!-- 搜索 -->
	<div class="clearfloat">
		<Select class="input left" clearable v-model="filter.user_id" placeholder="策略人" :loading='userLoading' :label-in-value='true' filterable remote :remote-method="remoteMethodUser">
			<Option v-for='item in userList' :key='item.id' :value='item.id'>{{item.name}}</Option>
		</Select>
		<Select class="input left" v-model="filter.agent_id" clearable placeholder="代理商名称" :loading='agentLoading' :label-in-value='true' filterable remote :remote-method="remoteMethodAgent">
			<Option v-for='item in agentList' :key='item.id' :value='item.id'>{{item.name}}</Option>
		</Select>
		<Select class="input left" v-model="filter.stock_id" clearable placeholder="股票名称" :loading='stockLoading' :label-in-value='true' filterable remote :remote-method="remoteMethodStock">
			<Option v-for='item in stockList' :key='item.id' :value='item.id'>{{item.stock_name}}</Option>
		</Select>
		<Col span="12" class="input">
		<DatePicker type="daterange" v-model='filter.time' placement="bottom-end" placeholder="充值时间" style="width: 200px"></DatePicker>
		</Col>
	</div>
	<!-- 表格 -->
	<Table :stripe="true" :loading="tableLoading" class="table" :columns="columns" :data="tableData"></Table>
	<!-- 分页 -->
	<Page size="small" class="page" :total="total" :current='page' :page-size='limit' @on-page-size-change='handlePageSize' :page-size-opts='[10,20,30,40]' @on-change='flip' show-sizer show-elevator show-total></Page>
</div>
</template>
<script>
export default {
	name: "autoDeferred",
	data() {
		return {
			limit: 10,
			page: 1,
			total: 1,
			tableLoading: false,
			userLoading: false,
			agentLoading: false,
			stockLoading: false,
			dialog: false,
			columns: [{
					title: '策略编号',
					key: 'policy_no',
					width: 200,
					align: 'center',
				},
				{
					title: '策略人信息',
					key: 'user_name',
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", params.row.user_name),
							h("div", params.row.agent_name),
							h("div", params.row.agent_account),
						])
					}
				},
				{
					title: '股票',
					key: 'stock_name',
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", params.row.stock_no),
							h("div", params.row.stock_name),
						])
					}
				},
				{
					title: '委托信息',
					key: 'deferredInfo',
					width: 150,
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", '保证金：' + params.row.assurance_amount),
							h("div", '委托数量：' + params.row.delegate_quantity),
						])
					}
				},
				{
					title: '成交时间',
					key: 'trade_buy_time',
					align: 'center',
					width: 160,
					sortable: true,
				},
				{
					title: '成交信息',
					key: 'dealInfo',
					align: 'center',
					width: 150,
					render: (h, params) => {
						return h("div", [
							h("div", '成交价格：' + params.row.trade_buy_price),
							h("div", '成交数量：' + params.row.trade_buy_quantity),
							h("div", '成交金额：' + params.row.trade_buy_amount),
						])
					}
				},
				{
					title: '浮动盈亏',
					key: 'float_profit',
					align: 'center'
				},
				{
					title: '递延费',
					key: 'hold_fee',
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", params.row.unit_hold_fee),
							h("div", params.row.hold_fee),
							h("div", params.row.hold_days + '天'),
						])
					}
				},
				{
					title: '是否自动递延',
					key: 'is_hold',
					align: 'center'
				},
				{
					title: '预计平仓时间',
					key: 'predict_sell_time',
					width: 160,
					align: 'center',
				},
				{
					title: '今日是否递延',
					key: 'is_today_hold',
					align: 'center',
				}
			],
			filter: {
				user_id: '',
				stock_id: '',
				agent_id: '',
				time: [],
			},
			userList: [],
			agentList: [],
			stockList: [],
			orderStatus: [],
			tableData: [],
		}
	},
	activated() {
		this.page = 1
		let para = {
			limit: this.limit,
			page: this.page
		}
		this.getData(para)
	},
	methods: {
		// 获取数据
		getData(para) {
			this.tableLoading = true
			let api = this.$api.strategy.policies_auto_hold
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
		// 翻页
		flip(page) {
			this.page = page
			this.handleSearch(0)
		},
		// 修改页数据量
		handlePageSize(size) {
			this.limit = size
			this.handleSearch(1)
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
		// 股票远程搜索
		remoteMethodStock(query) {
			if (query == '') {
				this.stockList = []
			} else {
				this.stockLoading = true
				this.stockList = []
				let api = this.$api.common.select_stock
				this.$axios.get(api, {
					params: {
						stock_no: query
					}
				}).then(res => {
					this.stockList = res.data
					for (let i in this.stockList) {
						this.stockList[i].id = (this.stockList[i].id).toString()
					}
					this.stockLoading = false
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
		// 搜索
		handleSearch(count) {
			var start_time = ''
			var end_time = ''
			if (this.filter.time[0] != '') {
				start_time = this.handletimer(this.filter.time[0])
			}
			if (this.filter.time[1] != '') {
				end_time = this.handletimer(this.filter.time[1])
			}
			if (count == 1) {
				this.page = 1
			}
			let para = {
				user_id: this.filter.user_id,
				end_time: end_time,
				start_time: start_time,
				stock_id: this.filter.stock_id,
				agent_id: this.filter.agent_id,
				limit: this.limit,
				page: this.page
			}
			this.getData(para)
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
		// 导出
		handleExport() {
			this.$Message.info('共能未开发')
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
