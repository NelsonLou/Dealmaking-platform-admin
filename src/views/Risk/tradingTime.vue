<!-- 时间管理 -->
<template>
<div id="tradingTime">
	<div class="clearfloat">
		<Button type="primary" class="left" @click='handleEdit'>修改交易时间</Button>
	</div>
	<!-- 表格 -->
	<Table :stripe="true" :loading="tableLoading" class="table" :columns="columns" :data="tableData"></Table>
	<!-- 弹窗 -->
	<Modal v-model="dialog" class="model" width="1000" title="申请提现" :loading='formLoading' :title="formTitle" @on-ok='submit' @on-cancel='dialogClose'>
		<!-- 表单 -->
		<Form label-position="right" :rules="rule" :model='formData' ref='formData' class="clearfloat" :label-width="160">
			<FormItem label="自动平仓时间：" prop='trade_sell_time'>
				<TimePicker confirm format="HH:mm" v-model='formData.trade_sell_time' style="width: 168px"></TimePicker>
			</FormItem>
			<FormItem label="递延发起时间：" prop='trade_hold_time'>
				<TimePicker confirm format="HH:mm" v-model='formData.trade_hold_time' style="width: 168px"></TimePicker>
			</FormItem>
			<FormItem label="上午开市时间：" prop='am_start_time'>
				<TimePicker confirm format="HH:mm" v-model='formData.am_start_time' style="width: 168px"></TimePicker>
			</FormItem>
			<FormItem label="上午休市时间：" prop='am_end_time'>
				<TimePicker confirm format="HH:mm" v-model='formData.am_end_time' style="width: 168px"></TimePicker>
			</FormItem>
			<FormItem label="下午开市时间  ：" prop='pm_start_time'>
				<TimePicker confirm format="HH:mm" v-model='formData.pm_start_time' style="width: 168px"></TimePicker>
			</FormItem>
			<FormItem label="下午休市时间  ：" prop='pm_end_time'>
				<TimePicker confirm format="HH:mm" v-model='formData.pm_end_time' style="width: 168px"></TimePicker>
			</FormItem>
		</Form>
	</Modal>
</div>
</template>
<script>
export default {
	name: "tradingTime",
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
			formTitle: '修改交易时间',
			tableLoading: false,
			dialog: false,
			columns: [{
					title: '自动平仓时间',
					key: 'trade_sell_time',
					align: 'center'
				},
				{
					title: '递延发起时间',
					key: 'trade_hold_time',
					align: 'center',
					width: 150,
				},
				{
					title: '上午开市时间',
					key: 'am_start_time',
					align: 'center'
				},
				{
					title: '上午休市时间',
					key: 'am_end_time',
					align: 'center'
				},
				{
					title: '下午开市时间',
					key: 'pm_start_time',
					align: 'center'
				},
				{
					title: '下午休市时间',
					key: 'pm_end_time',
					align: 'center'
				}
			],
			tableData: [],
			formData: {
				trade_sell_time: '',
				trade_hold_time: '',
				am_start_time: '',
				am_end_time: '',
				pm_start_time: '',
				pm_end_time: '',
			},
			rule: {
				trade_sell_time: [{
					validator: vali,
					trigger: 'blur'
				}],
				trade_hold_time: [{
					validator: vali,
					trigger: 'blur'
				}],
				am_start_time: [{
					validator: vali,
					trigger: 'blur'
				}],
				am_end_time: [{
					validator: vali,
					trigger: 'blur'
				}],
				pm_start_time: [{
					validator: vali,
					trigger: 'blur'
				}],
				pm_end_time: [{
					validator: vali,
					trigger: 'blur'
				}],
			}
		}
	},
	activated() {
		this.getData()
	},
	methods: {
		// 获取数据
		getData() {
			this.tableLoading = true
			let api = this.$api.risk.transaction_hour
			this.$axios.get(api).then(res => {
				this.tableData = []
				this.tableData.push(res.data.data)
				this.tableLoading = false
			}).catch(err => {
				console.log('接口错误' + api);
			})
		},
		// 修改
		handleEdit(row) {
			let api = this.$api.risk.transaction_hour
			this.$axios.get(api).then(res => {
				this.formData = {
					trade_sell_time: res.data.data.trade_sell_time,
					trade_hold_time: res.data.data.trade_hold_time,
					am_start_time: res.data.data.am_start_time,
					am_end_time: res.data.data.am_end_time,
					pm_start_time: res.data.data.pm_start_time,
					pm_end_time: res.data.data.pm_end_time,
				}
				this.dialog = true
			}).catch(err => {
				console.log('接口错误' + api);
			})
		},
		// 提交申请
		submit() {
			let api = this.$api.risk.transaction_hour
			this.$refs.formData.validate((valid) => {
				if (valid) {
					this.$axios.post(api, this.formData).then(res => {
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
