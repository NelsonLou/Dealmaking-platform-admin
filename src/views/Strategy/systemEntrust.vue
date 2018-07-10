<!-- 委托策略 -->
<template>
<div id="systemEntrust">
	<!-- 刷新按钮 -->
	<Button type="primary" @click='getData'>刷新</Button>
	<!-- 表格 -->
	<Table class="table" :stripe="true" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
	<!-- 弹窗 -->
	<Modal v-model="dialog" :loading='formLoading' class="model" width="1000" :title="formTitle" @on-ok="submit">
		<!-- 表单 -->
		<Form :model="formData" :rules="ruleAdd" ref='formData' label-position="right" class="clearfloat" on-cancel='resetform' :label-width="100">
			<!-- 基本信息表单 -->
			<div class="clearfloat">
				<div class="left" style="width:45%;">
					<FormItem label="策略编号：">
						<span>{{formData.policy_no}}</span>
					</FormItem>
					<FormItem label="策略人：">
						<span>{{formData.user_name}}</span>
					</FormItem>
					<FormItem label="代理商：">
						<span>{{formData.agent_name}}</span>
					</FormItem>
					<FormItem label="股票：">
						<span>{{formData.stock_name}}</span>
					</FormItem>
					<FormItem label="策略状态：">
						<span>{{formData.status_name}}</span>
					</FormItem>
				</div>
				<div class="left" style="width:45%;">
					<FormItem label="保证金：">
						<span>{{formData.assurance_amount}}</span>
					</FormItem>
					<FormItem label="委托数量：">
						<span>{{formData.delegate_quantity}}</span>
					</FormItem>
					<FormItem label="成交额：">
						<span>{{formData.trade_buy_amount}}</span>
					</FormItem>
					<FormItem label="原资金账户：">
						<span>{{formData.investor_name}}</span>
					</FormItem>
				</div>
			</div>
			<!-- 资金账户修改表单 -->
			<div v-if='action=="account"' style="border-top:1px solid #e9eaec;padding-top: 20px;">
				<FormItem label="新资金账户：" prop='newAccount'>
					<Select v-model='formData.newInvestor' class="formInput" @on-change='changeInvestor'>
						<Option :value='item.id' :key='item.id' v-for='item in investorsList'>{{item.investor_name}}</Option>
					</Select>
				</FormItem>
				<FormItem label="账户剩余资金：">
					<span>{{formData.investor_num}}</span>
				</FormItem>
			</div>
			<!-- 手动下单表单 -->
			<div v-else style="border-top:1px solid #e9eaec;padding-top: 20px;">
				<FormItem :label="numberTxt" prop='delegate_buy_no'>
					<Input v-model='formData.delegate_buy_no' class="formInput"></Input>
				</FormItem>
				<FormItem label="策略状态：" prop='strategyStatus'>
					<Select v-model='formData.policy_status' class="formInput">
						<Option v-for='item in formStatus' :value='item.value' :key='item.value'>{{item.label}}</Option>
					</Select>
				</FormItem>
				<FormItem label="警告状态：">
					<Select v-model='formData.policy_warning' class="formInput">
						<Option :value='1'>是</Option>
						<Option :value='0'>否</Option>
					</Select>
				</FormItem>
			</div>
		</Form>
		<Spin v-if='modelLoading' size='large' fix></Spin>
	</Modal>
</div>
</template>
<script>
export default {
	name: "systemEntrust",
	data() {
		return {
			time: '', // 服务器当前时间
			action: '', // 当前操作
			numberTxt: '委托编号：', // 策略编号title
			formTitle: '', // 弹窗title
			dialog: false, // 控制弹窗
			tableLoading: false, // 表格loading
			formLoading: true, // 表单loading
			modelLoading: false, // 弹窗loading
			status: ['平台委托中', '系统委托中', '已委托', '已成交', '平台平仓委托中', '系统平仓委托中', '平仓委托成功', '结算中', '已结算'], // 策略状态配置
			formStatus: [], // 表单内策略状态
			investorsList: [], // 资金账户数据
			tableData: [], // 表格数据
			ruleAdd: {}, // 表单添加规则
			formData: { // 表单数据
				policy_no: '', // 策略编号
				user_name: '', // 策略人
				agent_name: '', // 代理商姓名
				stock_name: '', // 股票名称
				status_name: '', // 策略状态名称
				assurance_amount: '', // 保证金
				delegate_quantity: '', // 委托数量
				trade_buy_amount: '', // 成交额
				newInvestor: '', // 新资金账户
				investor_num: '', // 账户剩余资金
				policy_warning: '', // 警告状态
				policy_status: '', // 策略状态
				delegate_buy_no: '', // 策略编号
			},
			buyStatus: [{ // 买入状态
					value: '1',
					label: '系统委托中'
				},
				{
					value: '0',
					label: '平台委托中'
				}
			],
			sellStatus: [{ // 卖出状态
					value: '1',
					label: '系统平仓委托中'
				},
				{
					value: '0',
					label: '平台平仓委托中'
				}
			],
			columns: [{ // 表格配置
					title: "策略编号",
					key: "policy_no",
					align: "center"
				},
				{
					title: "委托时间",
					key: "policy_no",
					align: "center",
					render: (h, params) => {
						return h("div", [
							h("div", params.row.delegate_buy_time == null ? 'B:--' : 'B:' + params.row.delegate_buy_time),
							h("div", params.row.delegate_sell_time == null ? 'S:--' : 'S:' + params.row.delegate_sell_time),
						])
					}
				},
				{
					title: "资金账号",
					key: "investor_name",
					align: "center",
				},
				{
					title: "策略人信息",
					key: "user_name",
					align: "center",
					render: (h, params) => {
						return h("div", [
							h("div", params.row.user_name),
							h("div", params.row.agent_name),
							h("div", params.row.agent_account),
						])
					}
				},
				{
					title: "股票",
					key: "stock_name",
					align: "center",
					render: (h, params) => {
						return h("div", [
							h("div", params.row.stock_no),
							h("div", params.row.stock_name),
						])
					}
				},
				{
					title: "买入信息",
					key: "buy_info",
					align: "center",
					width: 200,
					render: (h, params) => {
						return h("div", [
							h("div", params.row.assurance_amount == null ? '保证金：' : '保证金：' + params.row.assurance_amount),
							h("div", params.row.delegate_quantity == null ? '委托数量：' : '委托数量：' + params.row.delegate_quantity),
							h("div", params.row.trade_buy_quantity == null ? '买入数量：' : '买入数量：' + params.row.trade_buy_quantity),
							h("div", params.row.delegate_buy_no == null ? '委托编号：' : '委托编号：' + params.row.delegate_buy_no),
						])
					}
				},
				{
					title: "买入时间",
					key: "buy_time",
					align: "center",
				},
				{
					title: "策略状态",
					key: "policy_status",
					align: "center",
					render: (h, params) => {
						return h("div", [
							h("div", this.status[params.row.policy_status]),
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
										type: 'primary',
										size: "small",
									},
									style: {
										display: (params.row.policy_warning == 1) ? 'block' : 'none',
										marginRight: "5px",
										marginTop: "5px",
										marginBottom: "5px"
									},
									on: {
										click: () => {
											this.handleHandDeal(params.row)
										}
									}
								},
								'手动下单'
							),
							h(
								"Button", {
									props: {
										type: 'primary',
										size: "small",
									},
									style: {
										display: ((params.row.policy_status == 1 || params.row.policy_status == 0) && (params.row.policy_warning == 1)) ? 'block' : 'none',
										marginRight: "5px",
										marginTop: "5px",
										marginBottom: "5px"
									},
									on: {
										click: () => {
											this.handleAccount(params.row);
										}
									}
								},
								'资金账号修改'
							),
							h(
								"Button", {
									props: {
										type: 'primary',
										size: "small",
									},
									style: {
										display: ((params.row.policy_status == 4 || params.row.policy_status == 5) && (this.time >= 15)) ? 'block' : 'none',
										marginRight: "5px",
										marginTop: "5px",
										marginBottom: "5px"
									},
									on: {
										click: () => {
											this.handleUndo(params.row)
										}
									}
								},
								'委托撤销'
							)
						]);
					}
				}
			]
		}
	},
	activated() {
		this.getTime()
		this.getData()
		this.getInvestors()
	},
	methods: {
		// 获取数据
		getData() {
			this.tableLoading = true
			let api = this.$api.strategy.policies_entrust
			this.$axios.get(api).then(res => {
				this.tableData = res.data.data
				this.tableLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		// 委托撤销
		handleUndo(row) {
			this.$Modal.confirm({
				content: '<p>确认委托撤销！？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					let api = this.$api.strategy.policy_entrust_revoke
					let para = {
						id: row.id
					}
					this.$axios.post(api, para).then(res => {
						this.$Message.success(res.data.message);
						this.getData()
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.success('已取消');
				}
			});
		},
		// 资金账户修改
		handleAccount(row) {
			this.formTitle = '资金账户修改'
			this.action = 'account'
			this.getInvestors()
			this.modelLoading = true
			this.dialog = true
			let para = {
				id: row.id
			}
			let api = this.$api.strategy.policy_entrust_investor
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.formData = res.data.data
			}).catch(err => {
				console.log(err);
			})
		},
		// 手动处理
		handleHandDeal(row) {
			this.formTitle = '手动处理'
			this.action = 'handle'
			this.dialog = true
			this.modelLoading = true
			let para = {
				id: row.id
			}
			let api = this.$api.strategy.policy_entrust_investor
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.formData = res.data.data
				if (this.formData.policy_status < 3) {
					this.numberTxt = '买入委托编号：'
					this.formStatus = this.buyStatus
				} else {
					this.numberTxt = '卖出委托编号：'
					this.formStatus = this.sellStatus
				}
				this.modelLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		// 获取所有资金账户
		getInvestors() {
			let api = this.$api.common.investors
			this.$axios.get(api).then(res => {
				this.investorsList = res.data.data
				this.modelLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		// 修改资金账户弹窗内资金账户余额
		changeInvestor(value) {
			for (let i in this.investorsList) {
				if (value == this.investorsList[i].id) {
					this.formData.investor_num = this.investorsList[i].occupied_funds
					return
				}
			}
		},
		// 提交表单
		submit() {
			var api = ''
			var para = {}
			if (this.action == 'account') {
				api = this.$api.strategy.policy_investor_edit
				para = {
					id: this.formData.id,
					investor_id: this.formData.newInvestor
				}
			} else {
				if (this.formData.policy_status < 3) {
					api = this.$api.strategy.policies_entrust_manual_buy

				} else {
					api = this.$api.strategy.policies_entrust_manual_sell
				}
				para = {
					id: this.formData.id,
					policy_warning: this.formData.policy_warning,
					policy_status: this.formData.policy_status,
					delegate_buy_no: this.formData.delegate_buy_no,
				}
			}
			this.$refs.formData.validate((valid) => {
				if (valid) {
					this.$axios.post(api, para).then(res => {
						this.getData()
						this.dialog = false
						this.$Message.success(res.data.message)
						this.resetform()
					}).catch(err => {
						console.log(err);
						return this.changeLoading();
					})
				} else {
					return this.changeLoading();
				}
				setTimeout(() => {
					this.changeLoading();
				}, 1000);
			})
		},
		// 修改表单loading状态
		changeLoading() {
			this.formLoading = false;
			this.$nextTick(() => {
				this.formLoading = true;
			});
		},
		// 获取时间
		getTime() {
			let api = this.$api.common.server_time
			this.$axios.get(api).then(res => {
				this.time = new Date(res.data.data).getHours()
			}).catch(err => {
				console.log(err);
			})
		},
		// 重置表单
		resetform() {
			this.$refs.formData.resetFields();
		},
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
</style>
