<!-- 结算策略 -->
<template>
<div id="settlement" style="position:relative">
	<div class="clearfloat">
		<Button type="primary" class="left" @click='handleSearch(1)'>查询</Button>
		<Button type="primary" class="right" @click='handleExport'>导出</Button>
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
		<Select class="input left" v-model="filter.trade_sell_type" clearable placeholder="平仓状态">
			<Option v-for='item in statusList' :key='item.value' :value='item.value'>{{item.label}}</Option>
		</Select>
		<Col span="12" class="input">
		<DatePicker type="daterange" v-model='filter.time' placement="bottom-end" placeholder="结算时间" style="width: 200px"></DatePicker>
		</Col>
	</div>
	<!-- 表格 -->
	<Table :stripe="true" :loading="tableLoading" class="table" :columns="columns" :data="tableData"></Table>
	<!-- 分页 -->
	<Page size="small" class="page" :total="total" :current='page' :page-size='limit' @on-page-size-change='handlePageSize' :page-size-opts='[10,20,30,40]' @on-change='flip' show-sizer show-elevator show-total></Page>
	<!-- 弹出框 -->
	<Modal v-model="dialog" class="model" width="1000" title="详细信息">
		<Form :model="formData" ref='formData' label-position="right" class="clearfloat" on-cancel='resetform' :label-width="100">
			<div class="left" style="width:33%;">
				<FormItem label="策略编号：">
					<span>{{formData.policy_no}}</span>
				</FormItem>
				<FormItem label="股票：">
					<span>{{formData.stock_name}}({{formData.stock_no}})</span>
				</FormItem>
				<FormItem label="买入时间：">
					<span>{{formData.trade_buy_time}}</span>
				</FormItem>
				<FormItem label="卖出时间：">
					<span>{{formData.trade_sell_time}}</span>
				</FormItem>
				<FormItem label="止盈价格：">
					<span>{{formData.trade_profit_price}}</span>
				</FormItem>
				<FormItem label="成交价格：">
					<span>{{formData.trade_buy_price}}</span>
				</FormItem>
				<FormItem label="平仓类型：">
					<span>{{formData.trade_sell_type}}</span>
				</FormItem>
				<FormItem label="买入佣金：">
					<span>{{formData.trade_buy_fee}}</span>
				</FormItem>
				<FormItem label="卖出佣金：">
					<span>{{formData.trade_sell_fee}}</span>
				</FormItem>
			</div>
			<div class="left" style="width:33%;">
				<FormItem label="策略人：">
					<span>{{formData.user_name}}</span>
				</FormItem>
				<FormItem label="保证金：">
					<span>{{formData.assurance_amount}}</span>
				</FormItem>
				<FormItem label="止损价格：">
					<span>{{formData.trade_loss_price}}</span>
				</FormItem>
				<FormItem label="成交数量：">
					<span>{{formData.trade_buy_quantity}}</span>
				</FormItem>
				<FormItem label="策略状态：">
					<span>{{formData.status_name}}</span>
				</FormItem>
				<FormItem label="卖出过户费：">
					<span>{{formData.transfer_sell_fee}}</span>
				</FormItem>
				<FormItem label="买入过户费：">
					<span>{{formData.transfer_buy_fee}}</span>
				</FormItem>
				<FormItem label="单位递延费：">
					<span>{{formData.unit_hold_fee}}</span>
				</FormItem>
				<FormItem label="投资人分成：">
					<span>{{formData.investor_profit}}</span>
				</FormItem>
			</div>
			<div class="left" style="width:33%;">
				<FormItem label="代理商：">
					<span>{{formData.agent_name}}-{{formData.agent_account}}</span>
				</FormItem>
				<FormItem label="追加保证金：">
					<span>{{formData.addition_amount}}</span>
				</FormItem>
				<FormItem label="成交金额：">
					<span>{{formData.trade_buy_amount}}</span>
				</FormItem>
				<FormItem label="印花税：">
					<span>{{formData.stamp_duty}}</span>
				</FormItem>
				<FormItem label="递延天数：">
					<span>{{formData.hold_days}}</span>
				</FormItem>
				<FormItem label="策略人盈亏：">
					<span>{{formData.individual_profit}}</span>
				</FormItem>
				<FormItem label="盈亏总额：">
					<span>{{formData.total_profit}}</span>
				</FormItem>
				<FormItem label="退还金额：">
					<span>{{formData.return_amount}}</span>
				</FormItem>
				<FormItem label="递延费：">
					<span>{{formData.hold_fee}}</span>
				</FormItem>
			</div>
		</Form>
		<div slot="footer">
			<Button type='primary' @click="dialog = false">关闭</Button>
		</div>
		<Spin size="large" fix v-if="spinShow"></Spin>
	</Modal>
</div>
</template>
<script>
export default {
	name: "settlement",
	data() {
		return {
			limit: 10,
			page: 1,
			total: 1,
			tableLoading: false,
			userLoading: false,
			agentLoading: false,
			stockLoading: false,
			spinShow: false,
			dialog: false,
			columns: [{
					title: '策略编号',
					key: 'policy_no',
					width: 200,
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h(
								"Button", {
									props: {
										type: 'primary',
										size: "small",
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
								params.row.policy_no
							)
						]);
					}
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
					title: '保证金',
					key: 'deferredInfo',
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", params.row.assurance_amount),
							h("div", params.row.addition_amount),
						])
					}
				},
				{
					title: '成交时间',
					key: 'trade_buy_time',
					width: 150,
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", 'B：' + (params.row.trade_buy_time == null ? '--' : params.row.trade_buy_time)),
							h("div", 'S：' + (params.row.trade_sell_time == null ? '--' : params.row.trade_sell_time)),
						])
					}
				},
				{
					title: '止盈/止损',
					key: 'trade_buy_time',
					width: 100,
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", params.row.trade_profit_price + ' / ' + params.row.trade_loss_price),
						])
					}
				},
				{
					title: '是否自动递延',
					width: 100,
					key: 'auto_hold',
					align: 'center',
				},
				{
					title: '平仓类型',
					key: 'trade_sell_type',
					align: 'center',
				},
				{
					title: '盈亏总额',
					key: 'total_profit',
					align: 'center'
				},
				{
					title: '返还金额',
					width: 150,
					key: 'return_amount',
					align: 'center',
				},
				{
					title: '递延费',
					key: 'reason',
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
					title: '策略状态',
					key: 'status_name',
					align: 'center',
				}
			],
			filter: {
				user_id: '',
				stock_id: '',
				agent_id: '',
				time: [],
				trade_sell_type: '',
			},
			userList: [],
			agentList: [],
			stockList: [],
			statusList: [],
			tableData: [],
			formData: {
				id: 48745, // 订单id
				policy_no: "", // 订单编号
				user_name: "", // 用户姓名
				agent_account: "", // 代理商账号
				agent_name: "", // 代理商名称
				stock_no: "", // 股票代码
				stock_name: "", // 股票名称
				assurance_amount: "", //保证金
				addition_amount: "", //追加保证金
				trade_buy_time: "", //成交时间 买入
				trade_sell_time: '', //成交时间 卖出
				trade_profit_price: "", //止盈
				trade_loss_price: '', //止损
				trade_buy_price: '', //成交价格
				trade_buy_quantity: '', //成交数量
				trade_buy_amount: "", //成交金额
				trade_sell_type: "", //平仓类型
				status_name: "", //策略状态
				trade_buy_fee: "", //买入佣金
				trade_sell_fee: "", //卖出佣金
				transfer_buy_fee: "", //买入过户费
				transfer_sell_fee: "", //卖出过户费
				stamp_duty: "", //印花税
				unit_hold_fee: "", //单位递延费
				hold_fee: "", //递延费总额
				hold_days: '', //持仓天数
				total_profit: "", //盈亏总额
				return_amount: "", //退还金额
				investor_profit: "", //投资人分成
				individual_profit: "" //策略人盈亏
			},
		}
	},
	mounted() {
		this.getStatus()
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
			let api = this.$api.strategy.policies_settlement_today
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
		// 查看详细
		handleInfo(row) {
			this.dialog = true
			this.spinShow = true
			let api = this.$api.strategy.policy_settlement_today
			let para = {
				id: row.id
			}
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.formData = res.data.data
				this.spinShow = false
			}).catch(err => {
				console.log('错误接口', api);
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
				trade_sell_type: this.filter.trade_sell_type,
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
		// 获取平仓状态
		getStatus() {
			let api = this.$api.strategy.policy_trade_sell_type
			this.$axios.get(api).then(res => {
				this.statusList = []
				for (let i in res.data) {
					this.statusList.push({
						value: i,
						label: res.data[i],
					})
				}
			}).catch(err => {
				console.log('接口错误' + api);
			})
		},
		// 导出
		handleExport() {
			let api = this.$api.common.export_policies_settlement_today
			this.$Modal.confirm({
				content: '<p>确认导出为excel文件？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.get(api, {
						responseType: 'blob'
					}).then(res => {
						let fileName = new Date() + 'settlement_today.xlsx'
						this.$jsfiledownload(res.data, fileName);
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.info('已取消');
				}
			});
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
