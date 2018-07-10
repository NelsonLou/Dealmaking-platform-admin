<!-- 今日停牌 -->
<template>
<div id="todaySuspension" style="position:relative">
	<div class="" v-show='!addDialog'>
		<div class="clearfloat">
			<Button type="primary" class="left" @click='handleSearch(1)'>查询</Button>
			<Button type="primary" class="right" @click='handleAdd'>添加</Button>
		</div>
		<!-- 搜索 -->
		<div class="clearfloat">
			<Input class="input left" v-model="filter.stock_select" placeholder="股票代码"></Input>
			<Select class="input left" v-model="filter.ratio_id" clearable placeholder="风险等级">
				<Option v-for='item in riskLevel' :key='item.id' :value='item.id'>{{item.risk_level}}</Option>
			</Select>
		</div>
		<!-- 表格 -->
		<Table :stripe="true" :loading="tableLoading" class="table" :columns="columns" :data="tableData"></Table>
		<!-- 分页 -->
		<Page size="small" class="page" :total="total" :current='page' :page-size='limit' @on-page-size-change='handlePageSize' :page-size-opts='[10,20,30,40]' @on-change='flip' show-sizer show-elevator show-total></Page>
	</div>
	<!-- 平常 -->
	<div class="" v-show='addDialog'>
		<div class="clearfloat">
			<Select class="input left" v-model="formfilter.stock_id" clearable placeholder="股票代码/名称" :loading='stockLoading' :label-in-value='true' filterable remote :remote-method="remoteMethodStock">
				<Option v-for='item in stockList' :key='item.id' :value='item.id'>{{item.stock_name}}</Option>
			</Select>
			<Button type="primary" class="left" style="marginTop:20px;" @click='handleAddForm'>添加</Button>
		</div>
		<Table :stripe="true" class="table" :loading='formTableLoading' :columns="addColumns" :data="addTableData"></Table>
		<Button type="primary" class="left marginTop" @click='submit' :loading='btnLoading'>确定</Button>
		<Button type="primary" class="left marginLeft marginTop" @click='cancelSubmit'>取消</Button>
	</div>
</div>
</template>
<script>
export default {
	name: "todaySuspension",
	data() {
		return {
			limit: 10,
			page: 1,
			total: 0,
			tableLoading: false,
			formLoading: true,
			formTableLoading: false,
			stockLoading: false,
			btnLoading: false,
			addDialog: false,
			columns: [{
					type: 'index',
					width: 60,
					title: "No",
					align: "center"
				}, {
					title: 'ID',
					key: 'id',
					align: 'center'
				},
				{
					title: '股票代码',
					key: 'stock_no',
					align: 'center',
					width: 150,
				},
				{
					title: '股票名称',
					key: 'stock_name',
					align: 'center'
				},
				{
					title: '股票简称',
					key: 'first_letters',
					align: 'center'
				},
				{
					title: '上市时间',
					key: 'market_date',
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", this.handleDate(params.row.market_date)),
						])
					}
				},
				{
					title: '风险等级',
					key: 'risk_level',
					align: 'center'
				},
				{
					title: '是否可交易',
					key: 'stock_status',
					align: 'center'
				},
				{
					title: '停牌时间',
					key: 'stop_time',
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", this.handleDate(params.row.stop_time)),
						])
					}
				},
				{
					title: "操作",
					key: "action",
					width: 150,
					align: "center",
					render: (h, params) => {
						return h("div", [
							h(
								"Button", {
									props: {
										type: "primary",
										size: "small",
									},
									style: {
										marginRight: "5px",
										marginTop: "5px",
										marginBottom: "5px"
									},
									on: {
										click: () => {
											this.handleResu(params.row);
										}
									}
								},
								"编辑"
							)
						]);
					}
				}
			],
			addColumns: [{
					type: 'index',
					width: 60,
					title: "No",
					align: "center"
				}, {
					title: 'ID',
					key: 'id',
					align: 'center'
				},
				{
					title: '股票代码',
					key: 'stock_no',
					align: 'center',
					width: 150,
				},
				{
					title: '股票名称',
					key: 'stock_name',
					align: 'center'
				},
				{
					title: '股票简称',
					key: 'first_letters',
					align: 'center'
				},
				{
					title: '上市时间',
					key: 'market_date',
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", this.handleDate(params.row.market_date)),
						])
					}
				},
				{
					title: '风险等级',
					key: 'risk_level',
					align: 'center'
				},
				{
					title: '是否停牌',
					key: 'is_stop',
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", params.row.is_stop == 0 ? '否' : params.row.is_stop == 1 ? '是' : params.row.is_stop),
						])
					}
				},
				{
					title: '是否可交易',
					key: 'stock_status',
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", params.row.stock_status == 0 ? '否' : params.row.stock_status == 1 ? '是' : params.row.stock_status),
						])
					}
				},
				{
					title: '停牌时间',
					key: 'stop_time',
					align: 'center'
				}
			],
			filter: {
				stock_select: '',
				ratio_id: '',
			},
			formfilter: {
				stock_id: ''
			},
			agentList: [],
			stockList: [],
			orderStatus: [],
			formData: {
				id: '',
				stock_no: '',
				stock_name: '',
				market_date: '',
				is_stop: '',
				stock_status: '',
				ratio_id: '',
			},
			formRule: {},
			tableData: [],
			addTableData: [],
			riskLevel: [],
		}
	},
	activated() {
		this.getRiskLevel()
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
			let api = this.$api.risk.stop_stocks
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
		// 搜索
		handleSearch(count) {
			if (count == 1) {
				this.page = 1
			}
			let para = {
				ratio_id: this.filter.ratio_id,
				stock_select: this.filter.stock_select,
				limit: this.limit,
				page: this.page,
			}
			this.getData(para)
		},
		// 复牌
		handleResu(row) {
			this.$router.push({
				path: '/riskManage/sharesManage',
				name: 'sharesManage',
				params: {
					row: row
				}
			})
			// let api = this.$api.risk.start_stocks_edit
			// this.$Modal.confirm({
			// 	content: '<p>复牌该股票！？</p>',
			// 	okText: '确定',
			// 	cancelText: '取消',
			// 	onOk: () => {
			// 		this.$axios.post(api, {
			// 			id: row.id
			// 		}).then(res => {
			// 			this.$Message.success(res.data.message)
			// 			this.handleSearch(0)
			// 		}).catch(err => {
			// 			console.log('接口错误', api);
			// 		})
			// 	},
			// 	onCancel: () => {
			// 		this.$Message.info('已取消');
			// 	}
			// });
		},
		// 获取风险等级
		getRiskLevel() {
			let api = this.$api.common.select_risk_level
			this.$axios.get(api).then(res => {
				this.riskLevel = res.data
			}).catch(err => {
				console.log('接口错误', api);
			})
		},
		// 添加
		handleAdd() {
			this.addDialog = true
			this.addTableData = this.tableData
		},
		// 添加至表单
		handleAddForm() {
			if (this.formfilter.stock_id != '') {
				this.formTableLoading = true
				for (let i in this.addTableData) {
					if (this.addTableData[i].id == this.formfilter.stock_id) {
						this.$Message.error('不可重复添加')
						return
					}
				}
				let api = this.$api.risk.stock
				let para = {
					id: this.formfilter.stock_id
				}
				this.$axios.get(api, {
					params: para
				}).then(res => {
					this.addTableData.push(res.data.data)
					this.formfilter.stock_id = ''
					this.formTableLoading = false
				}).catch(err => {
					console.log('接口错误', api);
				})
			} else {
				this.$Message.error('请先选择希望添加的股票！')
			}

		},
		// 提交表单
		submit(action) {
			let api = this.$api.risk.stop_stocks_edit
			this.btnLoading = true
			let para = {
				id: []
			}
			for (let i in this.addTableData) {
				para.id.push(this.addTableData[i].id)
			}
			this.$axios.post(api, para).then(res => {
				this.$Message.success(res.data.message)
				this.btnLoading = false
				this.addDialog = false
				this.formfilter.stock_id = ''
				this.handleSearch(0)
			}).catch(err => {
				console.log('接口错误', api);
			})
		},
		// 取消添加
		cancelSubmit() {
			this.addDialog = false
			this.addTableData = []
			this.handleSearch(0)
		},
		// 重置表单
		resetform(formName) {
			this.$refs[formName].resetFields();
		},
		// 搜索股票
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
		// 处理时间
		handleDate(date) {
			if (date == '' || date == null) {
				return '--'
			} else {
				return date.substring(0, 10)
			}
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
