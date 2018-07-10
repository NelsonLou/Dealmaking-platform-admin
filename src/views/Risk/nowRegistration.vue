<!-- 当日股权登记 -->
<template>
<div id="nowRegistration" style="position:relative">
	<div class="clearfloat">
		<Button type="primary" class="left" @click='handleSearch(1)'>查询</Button>
	</div>
	<div class="clearfloat">
		<!-- 下拉框 -->
		<Select class="input left" :loading="selectLoading" v-model="filter.stock_id" clearable placeholder="股票" :label-in-value='true' filterable remote :remote-method="getStock">
			<Option v-for='item in stockList' :key='item.id' :value='item.id'>{{item.stock_name}}</Option>
		</Select>
	</div>
	<!-- 表格 -->
	<Table :stripe="true" :loading="tableLoading" class="table" :columns="columns" :data="tableData"></Table>
	<!-- 分页 -->
	<Page size="small" class="page" :total="total" :current='page' :page-size='limit' @on-page-size-change='handlePageSize' :page-size-opts='[10,20,30,40]' @on-change='flip' show-sizer show-elevator show-total></Page>
	<!-- 弹窗 -->
	<Modal v-model="dialog" class="model" width="1000" title="除权除息信息比对" @on-ok='dialog = false'>
		<!-- 表单 -->
		<Form label-position="right" :model='formData' class="clearfloat" :label-width="160">
			<div class="" style="border-bottom:1px solid #e9eaec">
				<span>{{formData.stock_no}}</span>
				<span>{{formData.stock_name}}</span>
				<span>{{formData.xrtxd_plan}}</span>
				<span>除权除息日时间：{{formData.xrtxd_date}}</span>
			</div>
			<div class="" style="border-bottom:1px solid #e9eaec">
				<span>策略编号：{{formData.policy_no}}</span>
				<span>策略人：{{formData.policy_name}}</span>
				<span>代理商：{{formData.agent_name}}-{{formData.agent_account}}</span>
			</div>
			<Table class="marginTop" size="small" :columns="formColumns" :data="formTableData"></Table>
		</Form>
		<div slot="footer">
			<Button type="primary" size="large" @click="dialog = false">确定</Button>
		</div>
		<Spin size="large" fix v-if="formLoading"></Spin>
	</Modal>
</div>
</template>
<script>
export default {
	name: "nowRegistration",
	data() {
		return {
			limit: 10,
			page: 1,
			total: 0,
			formTitle: '除权除息信息对比',
			selectLoading: false,
			tableLoading: false,
			formLoading: false,
			dialog: false,
			columns: [{
					title: '策略编号',
					key: 'policy_no',
					align: 'center',
					width: 150,
				},
				{
					title: '策略人',
					key: 'stock_name',
					align: 'center',
					width: 150,
				},
				{
					title: '股票',
					key: 'plan',
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", params.row.stock_name),
							h("div", params.row.stock_no),
						])
					}
				},
				{
					title: '成交价',
					key: 'trade_buy_price',
					align: 'center'
				},
				{
					title: '成交数量',
					key: 'trade_buy_quantity',
					align: 'center'
				},
				{
					title: '成交额',
					key: 'trade_buy_amount',
					align: 'center'
				},
				{
					title: '止盈价',
					key: 'trade_profit_price',
					align: 'center'
				},
				{
					title: '止损价',
					key: 'trade_loss_price',
					align: 'center'
				},
				{
					title: '保证金额度',
					key: 'assurance_amount',
					align: 'center'
				},
				{
					title: '代理商',
					key: 'status',
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", params.row.agent_name),
							h("div", params.row.agent_account),
						])
					}
				},
				{
					title: '除权除息日',
					key: 'record_date',
					align: 'center',
					width: 150,
					render: (h, params) => {
						return h("div", [
							h("div", this.handleDate(params.row.record_date)),
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
											this.handleExDividend(params.row);
										}
									}
								},
								"除权除息"
							),
						]);
					}
				}
			],
			filter: {
				stock_id: '',
			},
			stockList: [],
			tableData: [],
			formData: {
				stock_no: '',
				stock_name: '',
				xrtxd_plan: "",
				xrtxd_date: "",
				policy_no: "",
				policy_name: '',
				agent_name: "",
				agent_account: "",
				after: {},
				before: {},
			},
			formColumns: [{
					title: '',
					key: 'title',
					align: 'center'
				},
				{
					title: '成交市值',
					key: 'trade_buy_amount',
					align: 'center'
				},
				{
					title: '成交价',
					key: 'trade_buy_price',
					align: 'center'
				},
				{
					title: '单位递延费',
					key: 'unit_hold_fee',
					align: 'center'
				},
				{
					title: '成交量',
					key: 'trade_buy_quantity',
					align: 'center'
				},
				{
					title: '止盈价',
					key: 'trade_profit_price',
					align: 'center'
				},
				{
					title: '止损价',
					key: 'trade_loss_price',
					align: 'center'
				},
				{
					title: '保证金金额',
					key: 'assurance_amount',
					align: 'center'
				},
				{
					title: '追加保证金金额',
					key: 'addition_amount',
					align: 'center'
				},
				{
					title: '分红金额',
					key: 'XRTXD_dividends',
					align: 'center'
				},
			],
			formTableData: [],
		}
	},
	activated() {
		this.page = 1
		let para = {
			page: this.page,
			limit: this.limit,
		}
		this.getData(para)
	},
	methods: {
		// 获取数据
		getData(para) {
			this.tableLoading = true
			let api = this.$api.risk.rsp_today
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
		// 操作函数
		handleExDividend(row) {
			let api = this.$api.risk.rsp_xrtxd
			this.formLoading = true
			this.dialog = true
			this.$axios.get(api, {
				params: {
					id: row.id
				}
			}).then(res => {
				this.formData = {}
				this.formTableData = []
				this.formData = res.data.data
				this.formTableData.push(res.data.data.before)
				this.$set(this.formTableData[0], 'title', '方案前')
				this.$set(this.formTableData[0], 'XRTXD_dividends', 0)
				this.formTableData.push(res.data.data.after)
				this.$set(this.formTableData[1], 'title', '方案后')
				this.$set(this.formTableData[1], 'XRTXD_dividends', res.data.data.XRTXD_dividends)
				this.formLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		// 股票远程搜索
		getStock(query) {
			if (query == '') {
				this.stockList = []
			} else {
				this.selectLoading = true
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
					this.selectLoading = false
				}).catch(err => {
					console.log(err)
				})
			}
		},
		// 搜索
		handleSearch(count) {
			if (count == 1) {
				this.page = 1
			}
			let para = {
				page: this.page,
				limit: this.limit,
				stock_id: this.filter.stock_id,
			}
			this.getData(para)
		},
		// 处理时间
		handleDate(date) {
			if (date == '' || date == null) {
				return '--'
			} else {
				return date.substring(0, 10)
			}
		},
		// 修改页数据量
		handlePageSize(size) {
			this.limit = size
			this.handleSearch(1)
		},
		// 翻页
		flip(page) {
			this.page = page
			this.handleSearch(0)
		},
	}
}
</script>
<style scoped>
.formBox {
	text-align: center;
	width: 50%;
}

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
