<!-- 个股管理 -->
<template>
<div id="sharesManage" style="position:relative">
	<div class="clearfloat">
		<Button @click='handleSearch(1)' type="primary" class="left">查询</Button>
		<!-- <Button type="primary" class="right">导出</Button> -->
		<Button @click="handleAdd" type="primary" class="right marginRight">添加</Button>
	</div>
	<!-- 搜索 -->
	<div class="clearfloat">
		<Input class="input left" v-model="filter.stock_select" placeholder="股票代码"></Input>
		<Select class="input left" v-model="filter.ratio_id" clearable placeholder="风险等级">
			<Option v-for='item in riskLevel' :key='item.id' :value='item.id'>{{item.risk_level}}</Option>
		</Select>
		<Select class="input left" v-model="filter.is_stop" clearable placeholder="是否停牌">
			<Option :value='0'>否</Option>
			<Option :value='1'>是</Option>
		</Select>
		<Select class="input left" v-model="filter.stock_status" clearable placeholder="是否可交易">
			<Option :value='0'>否</Option>
			<Option :value='1'>是</Option>
		</Select>
	</div>
	<div class="clearfloat">
		<!-- 表格 -->
		<Table :stripe="true" :loading="tableLoading" class="table" :columns="columns" :data="tableData"></Table>
		<!-- 分页 -->
		<Page size="small" class="page" :total="total" :current='page' :page-size='limit' @on-page-size-change='handlePageSize' :page-size-opts='[10,20,30,40]' @on-change='flip' show-sizer show-elevator show-total></Page>
	</div>
	<!-- 弹窗 -->
	<Modal v-model="dialog" :loading='formLoading' width="1000" :title="formTitle" @on-ok="submit">
		<!-- 编辑表单 -->
		<Form :model="formData" :rules="formRule" ref='formData' label-position="right" on-cancel='resetform' :label-width="100">
			<FormItem label="股票代码：" prop='stock_no'>
				<Input class="formInput" v-model="formData.stock_no"></Input>
			</FormItem>
			<FormItem label="股票名称：" prop='stock_name'>
				<Input class="formInput" v-model="formData.stock_name"></Input>
			</FormItem>
			<FormItem label="上市时间：" prop='market_date'>
				<DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" style="width: 200px" v-model='formData.market_date'></DatePicker>
			</FormItem>
			<FormItem label="是否融资融券：" prop='financ'>
				<Select class="formInput" v-model="formData.financ" clearable>
					<Option :value='0'>否</Option>
					<Option :value='1'>是</Option>
				</Select>
			</FormItem>
			<FormItem label="证券市场：" prop='stock_market'>
				<Select class="formInput" v-model="formData.stock_market" clearable>
					<Option :value='1'>上海证券市场</Option>
					<Option :value='0'>深证证券市场</Option>
				</Select>
			</FormItem>
			<FormItem label="是否停牌：" prop='is_stop'>
				<Select class="formInput" v-model="formData.is_stop" clearable>
					<Option :value='0'>否</Option>
					<Option :value='1'>是</Option>
				</Select>
			</FormItem>
			<FormItem label="是否可交易：" prop='stock_status'>
				<Select class="formInput" v-model="formData.stock_status" clearable>
					<Option :value='0'>否</Option>
					<Option :value='1'>是</Option>
				</Select>
			</FormItem>
			<FormItem label="风险等级：" prop='ratio_id'>
				<Select class="formInput" v-model="formData.ratio_id" clearable>
					<Option v-for='item in riskLevel' :key='item.id' :value='item.id'>{{item.risk_level}}</Option>
				</Select>
			</FormItem>
		</Form>
		<Spin v-if="dialogLoading" fix size='large'></Spin>
	</Modal>
</div>
</template>

<script>
export default {
	name: "sharesManage",
	data() {
		return {
			limit: 10, // 表格煤业数据量
			page: 1, // 表格当前页
			total: 1, // 数据总量
			action: '', // 当前操作
			formTitle: '', // form表单title
			tableLoading: false, // 表格loading
			formLoading: true, // 表单loading
			dialogLoading: false, // 弹窗loading
			dialog: false, // 控制弹窗
			tableData: [], // 表格数据
			riskLevel: [], // 风险等级
			agentList: [], // 代理商列表
			stockList: [], // 股票列表
			formRule: {}, // 表单验证规则
			formData: { // 表单数据
				id: '', // 股票id
				stock_no: '', // 股票代码
				stock_name: '', //股票名称
				market_date: '', // 上市时间
				is_stop: '', // 是否停牌
				stock_status: '', // 是否可交易
				ratio_id: '', // 风险等级
				financ: '', // 是否融资融券
				stock_market: '', // 证券市场
			},
			filter: { // 搜索数据
				is_stop: '',
				ratio_id: '',
				stock_select: '',
				stock_status: '',
			},
			columns: [{ // 表格配置
					type: 'index',
					width: 60,
					title: "No",
					align: "center"
				}, {
					title: 'ID',
					key: 'id',
					align: 'center',
				},
				{
					title: '股票代码',
					key: 'stock_no',
					align: 'center',
				},
				{
					title: '股票名称',
					key: 'stock_name',
					align: 'center'
				},
				{
					title: '股票简称',
					key: 'first_letters',
					align: 'center',
				},
				{
					title: '上市日期',
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
					align: 'center',
				},
				{
					title: '是否融资融券',
					key: 'financ',
					align: 'center',
				},
				{
					title: '是否可交易',
					key: 'stock_status',
					align: 'center'
				},
				{
					title: '是否停牌',
					key: 'is_stop',
					align: 'center'
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
								"编辑"
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
		}
	},
	activated() {
		if (this.$route.params.row != undefined) {
			this.handleEdit(this.$route.params.row)
		}
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
			let api = this.$api.risk.stocks
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
				is_stop: this.filter.is_stop,
				ratio_id: this.filter.ratio_id,
				stock_select: this.filter.stock_select,
				stock_status: this.filter.stock_status,
				limit: this.limit,
				page: this.page,
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
		// 获取风险等级
		getRiskLevel() {
			let api = this.$api.common.select_risk_level
			this.$axios.get(api).then(res => {
				this.riskLevel = res.data
			}).catch(err => {
				console.log('接口错误', api);
			})
		},
		// 编辑
		handleEdit(row) {
			this.action = 'edit'
			this.formTitle = '个股编辑'
			this.dialogLoading = true
			this.dialog = true
			let api = this.$api.risk.stock
			let para = {
				id: row.id
			}
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.formData = res.data.data
				this.dialogLoading = false
			}).catch(err => {
				console.log('接口错误', api);
			})
		},
		// 添加
		handleAdd() {
			this.action = 'add'
			this.formTitle = '添加股票'
			this.resetform('formData')
			this.dialog = true
		},
		// 删除
		handleDelete(row) {
			let api = this.$api.risk.stocks_destroy
			this.$Modal.confirm({
				content: '<p>删除该股票！？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.post(api, {
						id: row.id
					}).then(res => {
						this.$Message.success(res.data.message)
						this.handleSearch(0)
					}).catch(err => {
						console.log('接口错误', api);
					})
				},
				onCancel: () => {
					this.$Message.info('已取消');
				}
			});
		},
		// 提交表单
		submit() {
			var api = ''
			var para = {}
			let formName = 'formData'
			if (this.action == 'edit') {
				api = this.$api.risk.stocks_edit + '/' + this.formData.id
				para = {
					id: this.formData.id,
					stock_no: this.formData.stock_no,
					stock_name: this.formData.stock_name,
					market_date: this.formData.market_date,
					is_stop: this.formData.is_stop,
					financ: this.formData.financ,
					stock_status: this.formData.stock_status,
					ratio_id: this.formData.ratio_id,
					stock_market: this.formData.stock_market,
				}
				if (para.market_date != '') {
					para.market_date = this.handletimer(para.market_date)
				}
			} else {
				api = this.$api.risk.stocks_create
				para = {
					stock_no: this.formData.stock_no,
					stock_name: this.formData.stock_name,
					market_date: this.formData.market_date,
					is_stop: this.formData.is_stop,
					financ: this.formData.financ,
					stock_status: this.formData.stock_status,
					ratio_id: this.formData.ratio_id,
					stock_market: this.formData.stock_market,
				}
				if (para.market_date != '') {
					para.market_date = this.handletimer(para.market_date)
				}
				delete para.id
			}
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$axios.post(api, para).then(res => {
						this.dialog = false
						this.$Message.success(res.data.message);
						let para = {
							limit: this.limit,
							page: this.page
						}
						this.getData(para)
						this.resetform('formData')
						this.handleSearch(0)
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
		// 改变loading状态
		changeLoading() {
			this.formLoading = false;
			this.$nextTick(() => {
				this.formLoading = true;
			});
		},
		// 重置表单
		resetform(formName) {
			this.$refs[formName].resetFields();
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
