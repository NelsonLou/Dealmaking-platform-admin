<!-- 充值列表 -->
<template>
<div id="recharge" style="position:relative">
	<div class="clearfloat">
		<Button type="primary" class="left" @click='handleSearch(1)'>查询</Button>
		<Button type="primary" class="right" @click='handleExport'>导出</Button>
	</div>
	<div class="clearfloat">
		<Select class="input left" clearable v-model="filter.user_id" placeholder="策略人" :loading='userLoading' :label-in-value='true' filterable remote :remote-method="remoteMethodUser">
			<Option v-for='item in userList' :key='item.id' :value='item.id'>{{item.name}}</Option>
		</Select>
		<Select class="input left" clearable v-model="filter.agent_account" placeholder="代理商名称" :loading='agentLoading' :label-in-value='true' filterable remote :remote-method="remoteMethodAgent">
			<Option v-for='item in agentList' :key='item.account' :value='item.account'>{{item.name}}</Option>
		</Select>
		<Input class="input left" v-model="filter.order_no" placeholder="充值单号"></Input>
		<Select v-model="filter.status" clearable class="input" placeholder='充值状态'>
            <Option v-for="(item,index) in orderStatus" :value="index" :key="index">{{item}}</Option>
        </Select>
		<Col span="12" class="input">
		<DatePicker type="daterange" v-model='filter.time' placement="bottom-end" placeholder="充值时间" style="width: 200px"></DatePicker>
		</Col>
	</div>
	<Table :stripe="true" :loading="tableLoading" class="table" :columns="columns" :data="tableData"></Table>
	<Page size="small" class="page" :total="total" :current='page' :page-size='limit' @on-page-size-change='handlePageSize' :page-size-opts='[10,20,30,40]' @on-change='flip' show-sizer show-elevator show-total></Page>
	<Modal v-model="dialog" class="model" width="1000" title="申请提现" :loading='formLoading' :title="formTitle" @on-ok='submit' @on-cancel='dialogClose'>
		<!-- 转账表单 -->
		<Form label-position="right" :rules="ruleDeal" :model='formData' ref='formData' class="clearfloat" :label-width="160">
			<FormItem label="姓名：" prop='user_name'>
				<Input class="formInput" :disabled='true' v-model="formData.user_name"></Input>
			</FormItem>
			<FormItem label="手机号：" prop='mobile'>
				<Input class="formInput" :disabled='true' v-model="formData.mobile"></Input>
			</FormItem>
			<FormItem label="充值金额：" prop='amount'>
				￥
				<Input class="formInput" :disabled='true' v-model="formData.amount"></Input>
			</FormItem>
			<FormItem label="支付宝到账金额：" prop='real_money'>
				￥
				<Input class="formInput" :disabled='formDisable' v-model="formData.real_money"></Input>
			</FormItem>
			<FormItem label="支付宝转账记录流水号：" prop='transaction_no'>
				<Input class="formInput" :disabled='formDisable' v-model="formData.transaction_no"></Input>
			</FormItem>
			<FormItem label="备注：" prop='remark'>
				<Input class="formInput" :disabled='formDisable' v-model="formData.remark"></Input>
			</FormItem>
		</Form>
		<Spin size="large" fix v-if="modelLoading"></Spin>
	</Modal>
</div>
</template>
<script>
export default {
	name: "recharge",
	data() {
		return {
			action: '',
			page: 1,
			total: 1,
			limit: 10,
			formLoading: true,
			tableLoading: false,
			userLoading: false,
			agentLoading: false,
			modelLoading: false,
			formTitle: '',
			dialog: false,
			columns: [{
					type: 'index',
					title: "No",
					width: 60,
					align: "center"
				},
				{
					title: '姓名',
					key: 'user_name',
					align: 'center'
				},
				{
					title: '代理商',
					key: 'agent_name',
					align: 'center',
					width: 150,
					render: (h, params) => {
						return h("div", [
							h("div", params.row.agent_name),
							h("div", params.row.account),
						])
					}
				},
				{
					title: '充值单号',
					key: 'order_no',
					align: 'center'
				},
				{
					title: '充值时间',
					key: 'time',
					align: 'center'
				},
				{
					title: '充值状态',
					key: 'status',
					align: 'center'
				},
				{
					title: '充值金额',
					key: 'money',
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", params.row.money.toFixed(2)),
						])
					}
				},
				{
					title: '充值渠道',
					key: 'channel',
					align: 'center',
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
										type: "warning",
										size: "small"
									},
									style: {
										display: (params.row.status == '已支付') ? 'none' : 'block',
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
							h(
								"Button", {
									props: {
										type: "primary",
										size: "small"
									},
									style: {
										display: (params.row.channel_type == 2 && params.row.status == '待支付') ? 'block' : 'none',
										marginRight: "5px",
										marginTop: "5px",
										marginBottom: "5px"
									},
									on: {
										click: () => {
											this.handleDeal(params.row);
										}
									}
								},
								"支付宝转账处理"
							)
						]);
					}
				}
			],
			filter: {
				order_no: '',
				status: '',
				time: [],
				user_id: '',
				agent_account: ''
			},
			userList: [],
			agentList: [],
			orderStatus: [],
			tableData: [],
			formData: {
				user_name: "",
				mobile: "",
				user_id: '',
				amount: "",
				id: "",
				transaction_no: '',
				real_money: '',
				remark: ''
			},
			formDisable: false,
			ruleDeal: {
				real_money: [{
					required: true,
					message: '到账金额为必填',
					trigger: 'blur'
				}],
				transaction_no: [{
					required: true,
					message: '记录流水号为必填',
					trigger: 'blur'
				}],
			}
		}
	},
	activated() {
		this.getOrderStatus()
	},
	methods: {
		// 获取数据
		getData(para) {
			this.tableLoading = true
			let api = this.$api.capital.order_list
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.tableData = res.data.items
				for (let i in this.tableData) {
					this.tableData[i].status = this.orderStatus[this.tableData[i].status]
				}
				this.total = res.data.total
				this.tableLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		// 操作函数
		handleDeal(row) {
			this.handleReset('formData')
			let api = this.$api.capital.order_alipay
			this.action = 'deal'
			this.modelLoading = true
			this.dialog = true
			this.$axios.get(api, {
				params: {
					id: row.id
				}
			}).then(res => {
				this.formData = {
					user_name: res.data.data.user.name,
					mobile: res.data.data.user.mobile,
					user_id: res.data.data.user.id,
					amount: (res.data.data.amount / 100).toFixed(2),
					id: res.data.data.id,
					transaction_no: '',
					real_money: '',
					remark: ''
				}
				this.modelLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		// 删除
		handleDelete(row) {
			let api = this.$api.capital.order_alipay_destroy
			let para = {
				id: row.id
			}
			this.$Modal.confirm({
				content: '<p>确认删除！？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.post(api, para).then(res => {
						this.$Message.success(res.data.message)
						this.getData({
							limit: this.limit,
							page: this.page
						})
					}).catch(err => {
						console.log(err);
					})
				}
			});
		},
		// 充值状态获取
		getOrderStatus() {
			this.tableLoading = true
			let api = this.$api.capital.order_status
			this.$axios.get(api).then(res => {
				this.orderStatus = res.data
				this.page = 1
				let para = {
					limit: this.limit,
					page: this.page
				}
				this.getData(para)
			}).catch(err => {
				console.log(err)
			})
		},
		// 搜索
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
				order_no: this.filter.order_no,
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
		// 提交申请
		submit() {
			var api = ''
			var para = {}
			var name = ''
			if (this.action == 'deal') {
				this.$refs.formData.validate((valid) => {
					if (valid) {
						this.action = 'dealB'
						this.formDisable = true
						this.$Message.warning('请确认转账信息是否正确');
						return this.changeLoading();
					} else {
						return this.changeLoading();
					}
				})
			} else if (this.action == 'dealB') {
				api = this.$api.capital.order_alipay_success
				para = {
					id: this.formData.id,
					real_money: this.formData.real_money,
					transaction_no: this.formData.transaction_no,
					remark: this.formData.remark
				}
				this.$axios.post(api, para).then(res => {
					this.$Message.success(res.data.message);
					this.getData({
						limit: this.limit,
						page: this.page
					})
					this.formDisable = false
					this.dialog = false

					this.handleReset('formData')
				}).catch(err => {
					console.log(err);
				})
				setTimeout(() => {
					this.changeLoading();
					this.modal1 = false;
				}, 1000);
			}
		},
		// 导出
		handleExport() {
			let api = this.$api.common.export_order_list
			this.$Modal.confirm({
				content: '<p>确认导出为excel文件？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.get(api, {
						responseType: 'blob'
					}).then(res => {
						let fileName = new Date() + 'recharge.xlsx'
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
		// 修改表单loading状态
		changeLoading() {
			this.formLoading = false;
			this.$nextTick(() => {
				this.formLoading = true;
			});
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
		// 重置表单
		handleReset(name) {
			this.$refs[name].resetFields();
		},
		// 弹窗关闭前
		dialogClose() {
			if (this.action == 'deal' || this.action == 'dealB') {
				this.dialog = false
				this.formDisable = false
				this.handleReset('formData')
			}
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
