<!-- 代理商列表 -->
<template>
<div id="agentsList" style="position:relative">
	<Button v-if='level!==0' @click='handleBack'>
		<Icon type="ios-arrow-back" ></Icon>
		返回
	</Button>
	<!-- 代理商基本信息 -->
	<Card v-if='level!==0' class='marginTop'>
		<p slot="title">{{infoData.name}} 基本信息</p>
		<ul class="clearfloat">
			<li class='left agentsList-li'>
				<span>{{infoData.account}}</span>
				<span class='gray'>代理商账号</span>
			</li>
			<li class='left agentsList-li'>
				<span>{{infoData.level}}</span>
				<span class='gray'>代理商等级</span>
			</li>
			<li class='left agentsList-li'>
				<span>{{infoData.invitation_code}}</span>
				<span class='gray'>代理商邀请码</span>
			</li>
			<li class='left agentsList-li'>
				<span>{{total}}</span>
				<span class='gray'>代理人数</span>
			</li>
			<li class='left agentsList-li'>
				<span>{{infoData.tel}}</span>
				<span class='gray'>联系方式</span>
			</li>
			<li class='left agentsList-li'>
				<span>{{infoData.address}}</span>
				<span class='gray'>联系地址</span>
			</li>
			<li class='left agentsList-li'>
				<span>{{infoData.investors}}</span>
				<span class='gray'>投资人</span>
			</li>
			<li class='left agentsList-li'>
				<span>{{infoData.created_at}}</span>
				<span class='gray'>创建时间</span>
			</li>
		</ul>
	</Card>
	<!-- 代理商账户信息 -->
	<Card v-if='level!==0' class="marginTop">
		<p slot="title">{{infoData.name}} 账户信息</p>
		<ul class="clearfloat">
			<li class='left agentsList-li'>
				<span>{{infoData.deferred_ratio}}</span>
				<span class='gray'>递延费比例</span>
			</li>
			<!-- <li class='left agentsList-li'>
                <span>{{infoData.profit_share==1?'是':'否'}}</span>
				<span class='gray'>是否分成</span>
			</li> -->
			<!-- <li class='left agentsList-li'>
                <span @click='goRouter("accSettlement")'>{{infoData.total_income}}￥</span>
				<span class='gray'>账户总收入</span>
			</li> -->
			<!-- <li class='left agentsList-li'>
				<span>{{infoData.balance}}￥</span>
				<span class='gray'>账户余额</span>
			</li> -->
			<!-- <li class='left agentsList-li'>
				<span>{{infoData.point}}</span>
				<span class='gray'>分成点数(%)</span>
			</li> -->
			<!-- <li class='left agentsList-li'>
				<span>{{infoData.bank_number}}</span>
				<span class='gray'>银行卡</span>
			</li> -->
			<!-- <li class='left agentsList-li'>
				<span @click='goRouter("ToCashRecord")'>{{infoData.withdrawing}}￥</span>
				<span class='gray'>提现中</span>
			</li> -->
			<!-- <li class='left agentsList-li'>
				<span>{{infoData.withdrawed}}￥</span>
				<span class='gray'>累计已提现</span>
			</li> -->
		</ul>
	</Card>
	<!-- 操作栏 -->
	<div class="marginTop clearfloat" v-if='level===0'>
		<Input class="formInput left" v-model="filter.name" placeholder="公司名称"></Input>
		<Input class="formInput marginLeft left" v-model="filter.account" placeholder="代理商账号"></Input>
		<Button type="primary" name="button" class="left marginLeft" @click='handleSearch(1)'>搜索</Button>
		<Button type="primary" name="button" class="right" @click='handleAdd'>添加代理商</Button>
	</div>
	<!-- 详细信息操作栏 -->
	<div class="marginTop clearfloat" v-else>
		<Input class="formInput left" v-model="filterInfo.name" placeholder="公司名称"></Input>
		<Button type="primary" name="button" class="left" @click='handleSearchInfo'>搜索</Button>
	</div>
	<!-- 表格 -->
	<Table :stripe="true" :loading="tableLoading" class="table marginTop" :columns="columns" :data="tableData"></Table>
	<!-- 分页 -->
	<Page size="small" class="page right" :total="total" :current='page' :page-size='limit' @on-page-size-change='handlePageSize' :page-size-opts='[10,20,30,40]' @on-change='flip' show-sizer show-elevator show-total></Page>
	<!-- 弹窗 -->
	<Modal v-model="dialog" :loading='formLoading' class="model" width="1000" :title="formTitle" @on-ok="submit">
		<!-- 修改表单 -->
		<Form :model="editFormData" v-show='action === "edit"' :rules="ruleEdit" ref='editFormData' label-position="right" :label-width="100">
			<FormItem label="代理商账号" prop='account'>
				<Input class="formInput" v-model="editFormData.account" :disabled="true"></Input>
			</FormItem>
			<FormItem label="公司名称" prop='name'>
				<Input class="formInput" v-model="editFormData.name"></Input>
			</FormItem>
			<FormItem label="联系方式" prop='tel'>
				<Input class="formInput" v-model="editFormData.tel"></Input>
			</FormItem>
			<FormItem label="联系地址" prop='address'>
				<Input class="formInput" v-model="editFormData.address"></Input>
			</FormItem>
			<FormItem label="递延费比例" prop='deferred_ratio'>
				<Select class="formInput" v-model="editFormData.deferred_ratio" clearable>
				<Option :value="item.value" v-for='item in deferredRatio' :key='item.value'>{{item.label}}</Option>
			</Select>
			</FormItem>
			</FormItem>
			<!-- <FormItem label="是否盈利分成" prop='profit_share'>
				<Select class="formInput" v-model="editFormData.profit_share" clearable>
				<Option :value="item.value" v-for='item in isShare' :key='item.value'>{{item.label}}</Option>
			</Select>
			</FormItem> -->
			<!-- <FormItem label="分成点数" prop='point'>
				<Input class="formInput" v-model="editFormData.point"></Input>
				</Select>
			</FormItem> -->
		</Form>
		<!-- 添加表单 -->
		<Form :model="addFormData" v-show='action === "add"' :rules="ruleAdd" ref='addFormData' label-position="right" :label-width="100">
			<FormItem label="代理商账号" prop='account'>
				<Input class="formInput" v-model="addFormData.account"></Input>
			</FormItem>
			<FormItem label="密码" prop='password'>
				<Input class="formInput" type='password' v-model="addFormData.password"></Input>
			</FormItem>
			<FormItem label="公司名称" prop='name'>
				<Input class="formInput" v-model="addFormData.name"></Input>
			</FormItem>
			<FormItem label="联系方式" prop='tel'>
				<Input class="formInput" v-model="addFormData.tel"></Input>
			</FormItem>
			<FormItem label="联系地址" prop='address'>
				<Input class="formInput" v-model="addFormData.address"></Input>
			</FormItem>
			<FormItem label="递延费比例" prop='deferred_ratio'>
				<Select class="formInput" v-model="addFormData.deferred_ratio" clearable>
				<Option :value="item.value" v-for='item in deferredRatio' :key='item.value'>{{item.label}}</Option>
			</Select>
			</FormItem>
			<!-- <FormItem label="是否盈利分成" prop='profit_share'>
				<Select class="formInput" v-model="addFormData.profit_share" clearable>
				<Option :value="item.value" v-for='item in isShare' :key='item.value'>{{item.label}}</Option>
			</Select>
			</FormItem> -->
			<!-- <FormItem label="分成点数" prop='point'>
				<Input class="formInput" v-model="addFormData.point"></Input>
				</Select>
			</FormItem> -->
		</Form>
	</Modal>
</div>
</template>
<script>
export default {
	name: "agentsList",
	data() {
		return {
			level: 0,
			dialog: false,
			formTitle: '',
			page: 1,
			total: 1,
			limit: 10,
			action: '',
			deferredRatio: [],
			isShare: [{
					value: 1,
					label: '是'
				},
				{
					value: 0,
					label: '否'
				}
			],
			tableLoading: false,
			formLoading: true,
			tableData: [],
			filter: {
				name: '',
				account: ''
			},
			filterInfo: {
				name: '',
			},
			infoData: {
				id: 9,
				name: '',
				total: '', // 代理人数
				pid: 1, //父集id
				account: "", //代理商账号
				level: 1, //代理商等级
				invitation_code: "", //代理商邀请码
				tel: "", //联系方式
				address: "", //联系地址
				created_at: "", //创建时间
				investors: "", //投资人
				deferred_ratio: "", //递延费比例
				// profit_share: -1, //是否盈利分成[0,1](正常不会有-1)
				point: 0, //分成点数
				bank_number: null, //银行卡号
				total_income: "", //账户总收入
				withdrawed: "", //已提现
				withdrawing: "", //提现中
				balance: "" //账户余额
			},
			editFormData: {
				id: '',
				account: '',
				name: '',
				tel: '',
				address: '',
				deferred_ratio: '',
				// profit_share: '',
			},
			addFormData: {
				account: null,
				tel: '',
				name: '',
				password: '',
				address: '',
				deferred_ratio: '',
				// profit_share: '',
			},
			ruleAdd: {},
			ruleEdit: {},
			columns: [{
					type: 'index',
					title: "No",
					align: "center",
					width: 60,
				},
				{
					title: "公司名称",
					key: "name",
					align: "center"
				},
				{
					title: "代理商账号",
					key: "account",
					align: "center"
				},
				{
					title: "等级",
					key: "level",
					align: "center"
				},
				{
					title: "联系方式",
					key: "tel",
					align: "center"
				},
				// {
				// 	title: "是否分成",
				// 	key: "profit_share",
				// 	align: "center",
				// 	render: (h, params) => {
				// 		return h("div", [
				// 			h("div", params.row.profit_share == 1 ? '是' : '否'),
				// 		])
				// 	}
				// },
				{
					title: "递延费比例",
					key: "deferred_ratio",
					align: "center"
				},
				{
					title: "操作",
					key: "action",
					align: "center",
					width: 150,
					render: (h, params) => {
						return h("div", [
							h(
								"Button", {
									props: {
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
											this.handleResetPwd(params.row);
										}
									}
								},
								"重置密码"
							),
							h(
								"Button", {
									props: {
										type: "error",
										size: "small"
									},
									style: {
										marginRight: "5px",
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
										type: "info",
										size: "small",
									},
									style: {
										marginRight: "5px",
										marginBottom: "5px"
									},
									on: {
										click: () => {
											this.page = 1
											let para = {
												page: this.page,
												limit: this.limit,
												id: params.row.id
											}
											this.level++
												this.getInfoData(para);
										}
									}
								},
								"查看详细"
							),
						]);
					}
				}
			],
		}
	},
	activated() {
		this.page = 1
		let para = {
			page: this.page,
			limit: this.limit,
		}
		this.getData(para)
		this.getDeferredRatio()
	},
	methods: {
		// 获取表格数据
		getData(para) {
			this.tableLoading = true
			let api = this.$api.agents.agentsList
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.tableData = res.data.items
				this.total = res.data.total
				this.tableLoading = false
			}).catch(err => {
				console.log('接口错误', api);
			})
		},
		// 获取比例
		getDeferredRatio() {
			let api = this.$api.agents.deferred_ratio
			this.$axios.get(api).then(res => {
				this.deferredRatio = []
				for (let i in res.data) {
					this.deferredRatio.push({
						value: res.data[i] + '0',
						label: res.data[i]
					})
				}
			}).catch(err => {
				console.log(err);
			})
		},
		// 翻页
		flip(page) {
			this.page = page
			if (this.level == 0) {
				this.handleSearch(0)
			} else {
				this.handleSearchInfo()
			}
		},
		// 修改页大小
		handlePageSize(size) {
			this.limit = size
			if (this.level == 0) {
				this.handleSearch(1)
			} else {
				this.handleSearchInfo(1)
			}
		},
		// 添加
		handleAdd() {
			this.action = 'add'
			this.resetform()
			this.addFormData.deferred_ratio = '0.003000'
			// this.addFormData.profit_share = 0
			this.dialog = true
			this.formTitle = '添加代理商'
		},
		// 修改
		handleEdit(row) {
			this.resetform()
			this.formTitle = '修改'
			this.action = 'edit'
			this.dialog = true
			this.formLoading = true
			let api = this.$api.agents.agents_account
			this.$axios.get(api, {
				params: {
					id: row.id
				}
			}).then(res => {
				this.editFormData.account = res.data.data.account
				this.editFormData.name = res.data.data.name
				this.editFormData.id = row.id
				this.editFormData.tel = res.data.data.tel
				this.editFormData.address = res.data.data.address
				this.editFormData.deferred_ratio = res.data.data.deferred_ratio
				// this.editFormData.profit_share = res.data.data.profit_share
				this.editFormData.point = res.data.data.point
				this.formLoading = false
			}).catch(err => {
				console.log('接口错误', api);
			})
		},
		// 删除
		handleDelete(row) {
			let para = {
				id: row.id
			}
			let api = this.$api.agents.agent_destroy
			this.$Modal.confirm({
				content: '<p>删除代理商！？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.post(api, para).then(res => {
						this.$Message.success('代理商已删除！')
						if (this.level == 0) {
							this.handleSearch(0)
						} else {
							this.handleSearchInfo(0)
						}
					}).catch(err => {
						console.log('接口错误', api);
					})
				}
			});
		},
		// 重置密码
		handleResetPwd(row) {
			let para = {
				id: row.id
			}
			let api = this.$api.agents.agents_password
			this.$Modal.confirm({
				content: '<p>确认重置密码！？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.post(api, para).then(res => {
						if (this.level == 0) {
							this.handleSearch(0)
						} else {
							this.handleSearchInfo(0)
						}
						this.$Message.success(res.data.message)
					}).catch(err => {
						console.log(err);
					})
				}
			});
		},
		// 提交表单
		submit() {
			let api;
			let para;
			let way;
			let formName;
			if (this.action == 'edit') {
				api = this.$api.agents.agents_edit
				para = {
					id: this.editFormData.id,
					name: this.editFormData.name,
					tel: this.editFormData.tel,
					address: this.editFormData.address,
					deferred_ratio: this.editFormData.deferred_ratio,
					// profit_share: this.editFormData.profit_share,
					point: 0,
				}
				way = 'post'
				formName = 'editFormData'
			} else if (this.action == 'add') {
				api = this.$api.agents.addAgents
				para = {
					account: this.addFormData.account,
					name: this.addFormData.name,
					id: this.addFormData.id,
					tel: this.addFormData.tel,
					password: this.addFormData.password,
					address: this.addFormData.address,
					deferred_ratio: this.addFormData.deferred_ratio,
					// profit_share: this.addFormData.profit_share,
					point: 0,
				}
				way = 'post'
				formName = 'addFormData'
			}
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$axios[way](api, para).then(res => {
						this.$Message.success(res.data.message);
						this.dialog = false
						this.resetform()
						if (this.level == 0) {
							this.handleSearch(0)
						} else {
							this.handleSearchInfo(0)
						}
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
		// 搜索
		handleSearch(count) {
			if (count == 1) {
				this.page = 1
			}
			let para = {
				page: this.page,
				limit: this.limit,
				name: this.filter.name,
				account: this.filter.account
			}
			this.getData(para)
		},
		// 重置表单
		resetform() {
			this.$refs.addFormData.resetFields();
			this.$refs.editFormData.resetFields();
		},
		// 改变loading状态
		changeLoading() {
			this.formLoading = false;
			this.$nextTick(() => {
				this.formLoading = true;
			});
		},

		// 查看详细内

		// 获取详细数据列表
		getInfoData(para) {
			this.tableLoading = true
			this.page = 1
			let api = this.$api.agents.agent
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.tableData = res.data.items
				this.infoData = res.data.navigate
				for (let i in this.infoData) {
					if (this.infoData[i] == null || this.infoData[i] == '') {
						this.infoData[i] = '--'
					}
				}
				for (let i in this.tableData) {
					// this.tableData[i].profit_share = '--'
					this.tableData[i].deferred_ratio = '--'
				}
				this.total = res.data.total
				this.tableLoading = false
			}).catch(err => {
				console.log('接口错误', api);
			})
		},
		// 搜索函数
		handleSearchInfo(count) {
			this.tableLoading = true
			if (count == 1) {
				this.page = 1
			}
			let para = {
				limit: this.limit,
				page: this.page,
				name: this.filterInfo.name,
				id: this.infoData.id,
			}
			this.getInfoData(para)
		},
		// 返回上级
		handleBack() {
			if (this.level == 1) {
				this.handleSearch(1)
				this.level--

			} else {
				this.page = 1
				let para = {
					page: this.page,
					limit: this.limit,
					id: this.infoData.pid,
				}
				this.getInfoData(para)
				this.level--
			}
		},
	}
}
</script>
<style scoped>
</style>
