<!-- 消息管理 -->
<template>
<div id="systemMessage" style="position:relative">
	<!-- 搜索框 -->
	<div class="clearfloat">
		<Select class="input left" clearable v-model="filter.user_id" placeholder="策略人" :label-in-value='true' filterable :loading='selectLoading' remote :remote-method="remoteMethodUser">
			<Option v-for='item in userList' :key='item.id' :value='item.id'>{{item.name}}</Option>
		</Select>
		<Select class="input left" clearable v-model="filter.type" placeholder="流水类型">
			<Option :value='1'>个人消息</Option>
            <Option :value='2'>系统消息</Option>
        </Select>
		<DatePicker class="input left" clearable type="datetimerange" placeholder="发布时间" v-model='filter.time' style="width: 300px"></DatePicker>
		<Button class="left" @click='handleSearch' type='primary'>查询</Button>
	</div>
	<!-- 表格 -->
	<Table class="table" :stripe="true" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
	<!-- 分页 -->
	<Page size="small" class="page" :total="total" :current='page' :page-size='limit' @on-page-size-change='handlePageSize' :page-size-opts='[10,20,30,40]' @on-change='flip' show-sizer show-elevator show-total></Page>
</div>
</template>
<script>
export default {
	name: "systemMessage",
	data() {
		return {
			selectLoading: false,
			tableLoading: false,
			tableData: [],
			type: [{
					value: 'a',
					label: '入金'
				},
				{
					value: 'b',
					label: '提现'
				},
				{
					value: 'c',
					label: '策略余额转出'
				},
				{
					value: 'd',
					label: '策略余额转入'
				}
			],
			total: 1,
			page: 1,
			limit: 10,
			filter: {
				user_id: '',
				type: '',
				time: []
			},
			userList: [],
			columns: [{ // 表格配置项
					type: 'index',
					width: 60,
					title: "No",
					align: "center"
				},
				{
					title: "策略人",
					key: "user_name",
					align: "center"
				}, {
					title: "推送时间",
					key: "publish_at",
					align: "center",
				}, {
					title: "消息类型",
					key: "type",
					align: "center",
				}, {
					title: "内容",
					key: "content",
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
											this.showContent(params.row);
										}
									}
								},
								"内容详情"
							),
						]);
					}
				}
			]
		}
	},
	activated() {
		let para = {
			limit: this.limit,
			page: this.page,
		}
		this.getData(para)
	},
	methods: {
		// 获取数据
		getData(para) {
			this.tableLoading = true
			let api = this.$api.content.messages
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.tableData = []
				for (let i = 0; i < res.data.items.length; i++) {
					this.tableData.push({
						user_name: res.data.items[i].user.name,
						publish_at: res.data.items[i].publish_at,
						type: res.data.items[i].type == 1 ? '个人消息' : '系统消息',
						content: res.data.items[i].content,
					})
				}
				this.total = res.data.total
				this.tableLoading = false
			}).catch(err => {
				console.log('接口错误' + api);
			})
		},
		// 翻页
		flip(page) {
			this.page = page
			this.handleSearch(0)
		},
		// 修改页大小
		handlePageSize(limit) {
			this.limit = limit
			this.handleSearch(1)
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
				type: this.filter.type,
				limit: this.limit,
				page: this.page
			}
			this.getData(para)
		},
		// 用户远程搜索
		remoteMethodUser(query) {
			if (query == '') {
				this.userList = []
			} else {
				this.selectLoading = true
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
					this.selectLoading = false
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
		// 纤细详细信息
		showContent(row) {
			this.$Modal.info({
				title: '内容详情',
				content: row.content,
			});
		}
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

.page {
	margin-top: 20px;
	margin-bottom: 20px;
}
</style>
