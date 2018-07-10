<!-- 停牌策略 -->
<template>
<div id="suspension" style="position:relative">
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
	<!-- 弹窗 -->
	<Modal v-model="dialog" :loading='formLoading' class="model" width="1000" title="买断" @on-ok="submit">
		<!-- 编辑表单 -->
		<Form :model="formData" :rules="rule" ref='formData' label-position="right" on-cancel='resetform' :label-width="150">
			<FormItem label="策略编号：">
				<span>{{formData.policy_no}}</span>
			</FormItem>
			<FormItem label="策略人：">
				<span>{{formData.user_name}}</span>
			</FormItem>
			<FormItem label="代理商：">
				<span>{{formData.agent_account}}</span>
			</FormItem>
			<FormItem label="股票：">
				<span>{{formData.stock_name}}({{formData.stock_no}})</span>
			</FormItem>
			<FormItem label="策略状态：">
				<span>{{formData.status_name}}</span>
			</FormItem>
			<FormItem label="预计平仓时间：">
				<span>{{formData.predict_sell_time}}</span>
			</FormItem>
			<FormItem label="保证金：">
				<span>{{formData.assurance_amount}}</span>
			</FormItem>
			<FormItem label="委托数量：">
				<span>{{formData.delegate_quantity}}</span>
			</FormItem>
			<FormItem label="递延费：">
				<span>{{formData.unit_hold_fee}}/天 共{{formData.hold_fee}}元 {{formData.hold_days}}天</span>
			</FormItem>
			<FormItem label="原资金账户：">
				<span>{{formData.investor_name}}</span>
			</FormItem>
			<div class="" style="border-top: 1px solid #e9eaec;padding-top:20px;">
				<FormItem label="买断需补齐金额：">
					<span>{{formData.buyout_amount}}元</span>
				</FormItem>
			</div>
		</Form>
		<Spin size="large" fix v-if="spinShow"></Spin>
	</Modal>
</div>
</template>
<script>
export default {
	name: "suspension",
	data() {
		return {
			limit: 10,
			page: 1,
			total: 1,
			tableLoading: false,
			userLoading: false,
			agentLoading: false,
			stockLoading: false,
			formLoading: true,
			spinShow: false,
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
					align: 'center',
					width: 150,
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
					width: 150,
				},
				{
					title: '成交信息',
					key: 'dealInfo',
					align: 'center',
					width: 200,
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
					width: 100,
					render: (h, params) => {
						return h("div", [
							h("div", params.row.unit_hold_fee),
							h("div", params.row.hold_fee),
							h("div", params.row.hold_days + '天'),
						])
					}
				},
				{
					title: '是否买断',
					key: 'buyout_flag',
					width: 150,
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", params.row.buyout_flag),
							h("div", {
									style: {
										display: params.row.buyout_flag == '是' ? 'block' : 'none'
									}
								},
								params.row.buyout_amount
							),
							h("div", {
									style: {
										display: params.row.buyout_flag == '是' ? 'block' : 'none'
									}
								},
								'补齐资金'
							),
						])
					}
				},
				{
					title: '预计平仓时间',
					key: 'predict_sell_time',
					align: 'center',
					width: 150,
				},
				{
					title: "操作",
					key: "action",
					align: "center",
					render: (h, params) => {
						return h("div", [
							h(
								"Button", {
									props: {
										type: "primary",
										size: "small"
									},
									style: {
										display: params.row.buyout_flag == '是' ? 'none' : 'block',
										marginRight: "5px",
										marginTop: "5px",
										marginBottom: "5px"
									},
									on: {
										click: () => {
											this.handleBuyOut(params.row);
										}
									}
								},
								"买断"
							),
						]);
					}
				}
			],
			filter: {
				user_id: '',
				stock_id: '',
				agent_id: '',
				status: '',
				time: [],
			},
			userList: [],
			agentList: [],
			stockList: [],
			rule: {},
			formData: {
				id: '',
				policy_no: "", //策略编号
				user_name: "", //策略人
				agent_account: "", //代理商
				agent_name: "", //代理商
				stock_no: "", //股票代码
				stock_name: "", //股票名称
				status_name: "", //策略状态
				predict_sell_time: "", // 预计平仓时间
				assurance_amount: "", //保证金
				addition_amount: "", //追加保证金
				delegate_quantity: '', //委托数量
				unit_hold_fee: "", //单递延费费
				hold_fee: "", //递延费总额
				hold_days: 1, //持仓天数
				investor_name: "", //资金账号
				buyout_amount: '', //买断需补齐金额
			},
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
			let api = this.$api.strategy.policies_stop
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
		// 买断
		handleBuyOut(row) {
			this.dialog = true
			this.spinShow = true
			let api = this.$api.strategy.policy_stop
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
		// 提交表单
		submit() {
			var api = this.$api.strategy.policy_stop_post
			var para = {
				id: this.formData.id
			}
			this.$Modal.confirm({
				content: '<p>确认买断！？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.post(api, para).then(res => {
						this.dialog = false
						this.$Message.success(res.data.message)
						this.handleSearch(0)
					}).catch(err => {
						console.log('接口错误', api);
						this.changeLoading()
					})
				},
				onCancel: () => {
					this.changeLoading()
					this.$Message.info('已取消');
				}
			});
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
			this.$Message.info('功能未完成')
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
