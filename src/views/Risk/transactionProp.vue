<!-- 交易比例 -->
<template>
<div id="transactionProp">
	<div class="clearfloat">
		<Button type="primary" class="right" @click='handleAdd'>添加交易比例</Button>
	</div>
	<!-- 表格 -->
	<Table :stripe="true" :loading="tableLoading" class="table" :columns="columns" :data="tableData"></Table>
	<!-- 弹窗 -->
	<Modal v-model="dialog" class="model" width="1000" title="申请提现" :loading='formLoading' :title="formTitle" @on-ok='submit' @on-cancel='dialogClose'>
		<!-- 表单 -->
		<Form label-position="right" :rules="rule" :model='formData' ref='formData' class="clearfloat" :label-width="160">
			<FormItem label="风险等级：" prop='risk_level'>
				<Input class="formInput" v-model="formData.risk_level"></Input>
			</FormItem>
			<FormItem label="配资比例：" prop='proportion_of_funding'>
				<Input class="formInput" v-model="formData.proportion_of_funding"></Input>
			</FormItem>
			<FormItem label="保证金额度：" prop='margin_amount'>
				<Input class="formInput" v-model="formData.margin_amount"></Input>
			</FormItem>
		</Form>
	</Modal>
</div>
</template>
<script>
export default {
	name: "transactionProp",
	data() {
		const vali = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('此项为必填'));
			} else {
				callback();
			}
		};
		return {
			formLoading: true,
			formTitle: '编辑',
			tableLoading: false,
			dialog: false,
			action: '',
			riskLevel: [],
			columns: [{
					type: 'index',
					width: 60,
					title: "No",
					align: "center"
				}, {
					title: '风险等级',
					key: 'risk_level',
					align: 'center'
				},
				{
					title: '配资比例',
					key: 'proportion_of_funding',
					align: 'center',
				},
				{
					title: '保证金额度',
					key: 'margin_amount',
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
							)
						]);
					}
				}
			],
			tableData: [],
			formData: {
				id: '',
				risk_level: '',
				margin_amount: '',
				proportion_of_funding: ''
			},
			rule: {
				risk_level: [{
					validator: vali,
					trigger: 'blur'
				}],
				margin_amount: [{
					validator: vali,
					trigger: 'blur'
				}],
				proportion_of_funding: [{
					validator: vali,
					trigger: 'blur'
				}],
			}
		}
	},
	mounted() {
		this.getRiskLevel()
		this.getData()
	},
	activated() {
		this.getRiskLevel()
		this.getData()
	},
	methods: {
		// 获取数据
		getData() {
			this.tableLoading = true
			let api = this.$api.risk.ratios
			this.$axios.get(api).then(res => {
				this.tableData = res.data.data
				this.tableLoading = false
			}).catch(err => {
				console.log('接口错误' + api);
			})
		},
		// 修改
		handleEdit(row) {
			this.action = 'edit'
			let api = this.$api.risk.ratio
			this.$axios.get(api, {
				params: {
					id: row.id
				}
			}).then(res => {
				this.formData = res.data.data
				this.dialog = true
			}).catch(err => {
				console.log('接口错误' + api);
			})
		},
		// 添加
		handleAdd() {
			this.action = 'add'
			this.handleReset('formData')
			this.dialog = true
		},
		// 提交申请
		submit() {
			let para = {}
			let api = ''
			if (this.action == 'edit') {
				api = this.$api.risk.ratio_edit + '/' + this.formData.id
				para = this.formData
			} else {
				api = this.$api.risk.ratio_create
				para = {
					risk_level: this.formData.risk_level,
					margin_amount: this.formData.margin_amount,
					proportion_of_funding: this.formData.proportion_of_funding,
				}
			}
			this.$refs.formData.validate((valid) => {
				if (valid) {
					this.$axios.post(api, para).then(res => {
						this.$Message.success(res.data.message);
						this.dialog = false
						this.handleReset('formData')
						this.getData()
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
		// 关闭弹窗前
		dialogClose() {
			this.dialog = false
			this.handleReset('formData')
		},
		// 获取风险等级
		getRiskLevel() {
			let api = this.$api.common.select_risk_level
			this.$axios.get(api).then(res => {
				this.riskLevel = res.data
			}).catch(err => {
				console.log('接口错误', api);
			})
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
