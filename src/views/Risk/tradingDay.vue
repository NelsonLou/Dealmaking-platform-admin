<!-- 禁止交易日 -->
<template>
<div id="tradingDay">
	<div class="clearfloat">
		<Button type="primary" class="right" @click='handleAdd'>添加非交易日</Button>
	</div>
	<div class="">
		<DatePicker class="marginTop" type="year" @on-change='handleSearch' v-model='filter.time'></DatePicker>
	</div>
	<!-- 表格 -->
	<Table :stripe="true" :loading="tableLoading" class="table" :columns="columns" :data="tableData"></Table>
	<!-- 弹窗 -->
	<Modal v-model="dialog" class="model" width="1000" title="申请提现" :rule='formRule' :loading='formLoading' :title="formTitle" @on-ok='submit' @on-cancel='dialogClose'>
		<!-- 表单 -->
		<Form label-position="right" :rules="formRule" :model='formData' ref='formData' class="clearfloat" :label-width="160">
			<FormItem label="日期：" prop='holiday'>
				<DatePicker class="formInput" v-model='formData.holiday'></DatePicker>
			</FormItem>
		</Form>
	</Modal>
</div>
</template>
<script>
export default {
	name: "tradingDay",
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
			formTitle: '添加非交易日',
			tableLoading: false,
			// 筛选数据
			filter: {
				time: ''
			},
			// 控制弹窗
			dialog: false,
			// 表格配置项
			columns: [{
					type: 'index',
					width: 60,
					title: "No",
					align: "center"
				}, {
					title: '日期',
					key: 'holiday',
					align: 'center',
					render: (h, params) => {
						return h("div", [
							h("div", this.handleDate(params.row.holiday)),
						])
					}
				},
				{
					title: '添加时间',
					key: 'created_at',
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
							)
						]);
					}
				}
			],
			// 表格数据
			tableData: [],
			// 表格数据
			formData: {
				holiday: ''
			},
			// 表单验证
			formRule: {
				holiday: [{
					validator: vali,
					trigger: 'blur'
				}],
			}
		}
	},
	mounted() {
		var time = new Date()
		this.filter.time = String(time.getFullYear())
		let para = {
			time: String(time.getFullYear())
		}
		this.getData(para)
	},
	activated() {
		var time = new Date()
		this.filter.time = String(time.getFullYear())
		let para = {
			time: String(time.getFullYear())
		}
		this.getData(para)
	},
	methods: {
		// 获取数据
		getData(para) {
			this.tableLoading = true
			let api = this.$api.risk.trading_day
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.tableData = []
				this.tableData = res.data.data
				this.tableLoading = false
			}).catch(err => {
				console.log('接口错误' + api);
			})
		},
		// 修改
		handleDelete(row) {
			let api = this.$api.risk.trading_day_destroy
			this.$Modal.confirm({
				content: '<p>确认删除！？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.post(api, {
						id: row.id
					}).then(res => {
						this.$Message.success(res.data.message)
						var time = new Date()
						let para = {
							time: String(time.getFullYear())
						}
						this.getData(para)
					}).catch(err => {
						console.log('接口错误', api);
					})
				},
				onCancel: () => {
					this.$Message.info('已取消');
				}
			});
		},
		// 添加非交易日
		handleAdd() {
			this.dialog = true
		},
		// 按照时间搜索
		handleSearch(time) {
			let para = {
				time: time
			}
			this.getData(para)
		},
		// 提交申请
		submit() {
			let api = this.$api.risk.trading_day_create
			this.$refs.formData.validate((valid) => {
				if (valid) {
					let holiday = this.handletimer(this.formData.holiday)
					this.$axios.post(api, {
						holiday: holiday
					}).then(res => {
						this.$Message.success(res.data.message);
						this.dialog = false
						this.handleReset('formData')
						let time = String(this.filter.time.getFullYear())
						this.handleSearch(time)
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
		// 时间戳处理
		handletimer(date) {
			let eyear = date.getFullYear()
			let emonth = Number(date.getMonth()) + 1
			if (Number(emonth) < 10) {
				emonth = '0' + emonth
			}
			let eday = date.getDate()
			if (Number(eday) < 10) {
				eday = '0' + eday
			}
			return eyear + '-' + emonth + '-' + eday
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
