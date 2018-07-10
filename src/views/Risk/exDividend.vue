<!-- 除权除息 -->
<template>
<div id="exDividend" style="position:relative">
	<div class="clearfloat">
		<Button type="primary" class="left" @click='handleSearch(1)' :loading='searchLoading'>查询</Button>
		<!-- <Button type="primary" class="right">导出</Button> -->
		<Button type="primary" class="right" @click='handleAdd' style="margin-right:10px;">添加新方案</Button>
	</div>
	<div class="clearfloat">
		<!-- 下拉框 -->
		<Select class="input left" :loading='stockLoading' v-model="filter.stock_id" clearable placeholder="股票" :label-in-value='true' filterable remote :remote-method="remoteMethodStock">
			<Option v-for='(item, index) in stockList' :key='index' :value='item.id'>{{item.stock_name}}</Option>
		</Select>
		<!-- 下拉框 -->
		<Select v-model="filter.status" clearable class="input left" placeholder='状态'>
			<Option :value="0">未登记</Option>
			<Option :value="1">已登记</Option>
		</Select>
		<!-- 日期区间选择 -->
		<Col span="12" class="input left">
		<DatePicker type="daterange" v-model='filter.time' placement="bottom-end" placeholder="除权除息日" style="width: 200px"></DatePicker>
		</Col>
	</div>
	<!-- 表格 -->
	<Table :stripe="true" :loading="tableLoading" class="table" :columns="columns" :data="tableData"></Table>
	<!-- 分页 -->
	<Page size="small" class="page" :total="total" :current='page' :page-size='limit' @on-page-size-change='handlePageSize' :page-size-opts='[10,20,30,40]' @on-change='flip' show-sizer show-elevator show-total></Page>
	<!-- 弹窗 -->
	<Modal v-model="dialog" class="model" width="1000" :loading='formLoading' :title="formTitle" @on-ok='submit'>
		<!-- 表单 -->
		<Form label-position="right" :rules="rule" :model='formData' ref='formData' class="clearfloat" :label-width="160">
			<FormItem label="股票代码：" prop='stock_id'>
				<Select class="formInput" :loading='formStockLoading' v-show='action == "add"' v-model="formData.stock_id" clearable placeholder="股票" :label-in-value='true' filterable remote :remote-method="remoteMethodFormStock">
					<Option v-for='(item, index) in formStockList' :key='item.id' :value='item.id'>{{item.stock_name}}</Option>
				</Select>
				<Input class="formInput" v-show='action == "edit"' :disabled='true' v-model="formData.stock_name">{{}}</Input>
			</FormItem>
			<FormItem label="基础股票：" prop='basic'>
				<Input class="formInput" placeholder='请输入整数' v-model="formData.basic"></Input>
			</FormItem>
			<FormItem label="送股股数：" prop='scrip_issue'>
				<Input class="formInput" v-model="formData.scrip_issue"></Input>
			</FormItem>
			<FormItem label="转股股数：" prop='transfer'>
				<Input class="formInput" v-model="formData.transfer"></Input>
			</FormItem>
			<FormItem label="股利金额：" prop='dividend'>
				<Input class="formInput" v-model="formData.dividend"></Input>
			</FormItem>
			<FormItem label="除权除息日：" prop='record_date'>
				<DatePicker class="formInput" type="date" v-model="formData.record_date"></DatePicker>
			</FormItem>
			<FormItem label="备注：" prop='remark'>
				<Input class="formInput" type='textarea' v-model="formData.remark"></Input>
			</FormItem>
		</Form>
		<Spin size="large" fix v-if="modelLoading"></Spin>
	</Modal>
</div>
</template>
<script>
export default {
	name: "exDividend",
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
			limit: 10,
			page: 1,
			total: 1,
			formLoading: true,
			selectLoading: false,
			searchLoading: false,
			tableLoading: false,
			stockLoading: false,
			formStockLoading: false,
			modelLoading: false,
			formTitle: '',
			dialog: false,
			formDisable: false,
			stockList: [],
			formStockList: [],
			orderStatus: [],
			tableData: [],
			columns: [{
					title: '股票代码',
					key: 'stock_no',
					align: 'center'
				},
				{
					title: '股票名称',
					key: 'stock_name',
					align: 'center',
					width: 150,
				},
				{
					title: '分红方案',
					key: 'plan',
					align: 'center'
				},
				{
					title: '除权除息日',
					key: 'record_date',
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", this.handleDate(params.row.record_date)),
						])
					}
				},
				{
					title: '备注',
					key: 'remark',
					align: 'center'
				},
				{
					title: '状态',
					key: 'status',
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
								"查看策略"
							),
							h(
								"Button", {
									props: {
										disabled: params.row.status == '未登记' ? false : true,
										type: "warning",
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
						]);
					}
				}
			],
			filter: {
				stock_id: '',
				status: '',
				time: [],
			},
			formData: {
				id: '',
				stock_name: '',
				stock_id: "",
				stock_no: "",
				basic: "",
				scrip_issue: '',
				transfer: "",
				dividend: "",
				record_date: '',
				remark: ''
			},
			rule: {
				stock_id: [{
					validator: vali,
					trigger: 'blur'
				}],
				basic: [{
					validator: vali,
					trigger: 'blur'
				}],
				scrip_issue: [{
					validator: vali,
					trigger: 'blur'
				}],
				transfer: [{
					validator: vali,
					trigger: 'blur'
				}],
				dividend: [{
					validator: vali,
					trigger: 'blur'
				}],
				record_date: [{
					validator: vali,
					trigger: 'blur'
				}],
				remark: [{
					validator: vali,
					trigger: 'blur'
				}],
			}
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
			let api = this.$api.risk.xrtxds
			this.$axios.get(api, {
				params: para
			}).then(res => {
				for (let i in res.data.items) {
					if (res.data.items[i].status == 0) {
						res.data.items[i].status = '未登记'
					} else {
						res.data.items[i].status = '已登记'
					}
				}
				this.tableData = res.data.items
				this.total = res.data.total
				setTimeout(() => {
					this.searchLoading = false
					this.tableLoading = false
				}, 500);
			}).catch(err => {
				console.log('接口错误', api);
			})
		},
		// 搜索
		handleSearch(count) {
			var start_time = ''
			var end_time = ''
			this.searchLoading = true
			if (this.filter.time[0] > 0) {
				start_time = this.handletimer(this.filter.time[0])
				end_time = this.handletimer(this.filter.time[1])
			}
			if (this.filter.time[1] > 0) {
				start_time = this.handletimer(this.filter.time[0])
				end_time = this.handletimer(this.filter.time[1])
			}
			if (count == 1) {
				this.page = 1
			}
			let para = {
				status: this.filter.status,
				end_time: end_time,
				start_time: start_time,
				stock_id: this.filter.stock_id,
				limit: this.limit,
				page: this.page
			}
			this.getData(para)
		},
		// 查看详细
		handleInfo(row) {
			this.$router.push({
				path: '/risk/beforeRegistration',
				name: 'beforeRegistration',
				params: {
					row: row
				}
			});
		},
		// 编辑
		handleEdit(row) {
			this.dialog = true
			this.action = 'edit'
			this.formTitle = '修改'
			this.modelLoading = true
			let api = this.$api.risk.xrtxd
			this.$axios.get(api, {
				params: {
					id: row.id
				}
			}).then(res => {
				this.formData = {
					id: row.id,
					stock_no: res.data.data.stock_no,
					stock_name: res.data.data.stock_name,
					stock_id: res.data.data.stock_id,
					basic: res.data.data.basic,
					scrip_issue: res.data.data.scrip_issue,
					transfer: res.data.data.transfer,
					dividend: res.data.data.dividend,
					record_date: res.data.data.record_date,
					remark: res.data.data.remark
				}
				setTimeout(() => {
					this.modelLoading = false
				}, 1000);
			}).catch(err => {
				console.log('接口错误' + api);
			}).then(() => {})
		},
		// 添加
		handleAdd() {
			this.formTitle = '添加新方案'
			this.handleReset('formData')
			this.dialog = true
			this.action = 'add'
		},
		// 翻页
		flip(page) {
			this.page = page
			this.handleSearch(0)
		},
		// 修改页大小
		handlePageSize(size) {
			this.limit = size
			this.handleSearch(1)
		},
		// 提交申请
		submit() {
			var api = ''
			var para = {}
			var way = ''
			var date = ''
			if (this.action == 'add') {
				if (this.formData.record_date != '') {
					let fyear = this.formData.record_date.getFullYear()
					let fmonth = Number(this.formData.record_date.getMonth()) + 1
					let fday = this.formData.record_date.getDate()
					date = fyear + '-' + fmonth + '-' + fday
				} else {
					date = ''
				}
				api = this.$api.risk.xrtxds_create
				para = {
					stock_id: this.formData.stock_id,
					basic: this.formData.basic,
					scrip_issue: this.formData.scrip_issue,
					transfer: this.formData.transfer,
					dividend: this.formData.dividend,
					record_date: date,
					remark: this.formData.remark,
				}
				way = 'post'
			} else if (this.action == 'edit') {
				if (this.formData.record_date != '') {
					let fyear = this.formData.record_date.getFullYear()
					let fmonth = Number(this.formData.record_date.getMonth()) + 1
					let fday = this.formData.record_date.getDate()
					date = fyear + '-' + fmonth + '-' + fday
				} else {
					date = ''
				}
				api = this.$api.risk.xrtxds_edit
				para = {
					id: this.formData.id,
					stock_id: this.formData.stock_id,
					basic: this.formData.basic,
					scrip_issue: this.formData.scrip_issue,
					transfer: this.formData.transfer,
					dividend: this.formData.dividend,
					record_date: date,
					remark: this.formData.remark,
				}
				way = 'post'
			} else {
				this.page = 1
				let para = {
					limit: this.limit,
					page: this.page
				}
				this.handleReset('formData')
				this.getData(para)
				this.dialog = false
				return this.changeLoading();
			}
			this.$refs.formData.validate((valid) => {
				if (valid) {
					this.$axios[way](api, para).then(res => {
						this.$Message.success(res.data.message);
						this.dialog = false
						this.handleReset('formData')
						this.page = 1
						let para = {
							limit: this.limit,
							page: this.page
						}
						this.getData(para)
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
		// 股票远程搜索
		remoteMethodStock(query) {
			if (query == '') {
				this.stockList = []
			} else {
				this.stockLoading = true
				let api = this.$api.common.select_stock
				let para = {
					stock_no: query
				}
				this.$axios.get(api, {
					params: para
				}).then(res => {
					this.stockList = res.data
					for (let i in this.stockList) {
						this.stockList[i].id = (this.stockList[i].id).toString()
					}
					this.stockLoading = false
				}).catch(err => {
					console.log('接口错误', api);
				})
			}
		},
		// 表单内股票远程搜索
		remoteMethodFormStock(query) {
			if (query == '') {
				this.formStockList = []
			} else {
				let api = this.$api.common.select_stock
				let para = {
					stock_no: query
				}
				this.$axios.get(api, {
					params: para
				}).then(res => {
					this.formStockList = res.data
					this.formStockLoading = false
				}).catch(err => {
					console.log(err);
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

.display {
	visibility: hidden;
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
