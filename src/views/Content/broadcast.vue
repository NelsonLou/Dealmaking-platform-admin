<!-- 播报信息管理 -->
<template>
<div id="broadcast" style="position:relative">
	<!-- 搜索框 -->
	<div class="clearfloat">
		<Input v-model='filter.title' clearable class="input left" placeholder='标题'></Input>
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
	name: "broadcast",
	data() {
		return {
			tableLoading: false,
			userLoading: false,
			tableData: [],
			total: 1,
			formData: {},
			page: 1,
			limit: 10,
			filter: {
				user_id: '',
				type: '',
				time: []
			},
			userList: [],
			columns: [{
					type: 'index',
					width: 60,
					title: "No",
					align: "center"
				},
				{
					title: "标题",
					key: "title",
					align: "center"
				}, {
					title: "发布时间",
					key: "created_at",
					align: "center"
				}, {
					title: "内容",
					key: "content",
					align: "center"
				}, {
					title: "操作",
					key: "action",
					width: 250,
					align: "center",
					render: (h, params) => {
						return h("div", [
							// 删除
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
							// 内容预览
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
											this.handlePreview(params.row);
										}
									}
								},
								// 名字为动态
								'内容预览'
							)
						]);
					}
				}
			]
		}
	},
	activated() {
		this.page = 1
		let para = {
			limit: this.limit,
			page: this.page,
		}
		this.getData(para)
	},
	methods: {
		// 获取数据
		getData(para) {
			let api = this.$api.content.broadcasts
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.tableData = res.data.items
				this.total = res.data.total
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
				create_id: this.filter.create_id,
				limit: this.limit,
				page: this.page
			}
			this.getData(para)
		},
		// 删除
		handleDelete(row) {
			let api = this.$api.content.broadcasts_destroy
			let para = {
				id: row.id
			}
			this.$Modal.warning({
				content: '<p>确认删除！？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.post(api, para).then(res => {
						this.$Message.success('删除成功！')
						this.page = 1
						let para = {
							page: this.page,
							limit: this.limit,
						}
						this.getData(para)
					}).catch(err => {
						console.log('接口错误' + api);
					})
				}
			});
		},
		// 内容预览
		handlePreview(row) {
			this.dialog = true
			let api = this.$api.content.broadcast
			let para = {
				id: row.id
			}
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.$Modal.info({
					title: '内容详情',
					content: res.data.content,
				});
			}).catch(err => {
				console.log('接口错误', api);
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
