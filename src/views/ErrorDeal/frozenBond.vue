<!-- 冻结保证金 -->
<template>
<div id="frozenBond" style="position:relative">
	<Table class="table" :stripe="true" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
	<Page size="small" class="page" :total="total" :current='page' :page-size='limit' @on-page-size-change='handlePageSize' :page-size-opts='[10,20,30,40]' @on-change='flip' show-sizer show-elevator show-total></Page>
</div>
</template>
<script>
export default {
	name: "frozenBond",
	data() {
		return {
			tableLoading: false,
			columns: [{
					type: 'index',
					width: 60,
					title: "No",
					align: "center"
				},
				{
					title: "姓名",
					key: "uname",
					align: "center"
				},
				{
					title: "代理商",
					key: "title",
					align: "center",
					render: (h, params) => {
						return h("div", [
							h("div", params.row.aname),
							h("div", params.row.account),
						])
					}
				},
				{
					title: "手机号",
					key: "mobile",
					align: "center"
				},
				{
					title: "冻结保证金金额",
					key: "frozen_amount",
					align: "center"
				},
				{
					title: "实际持仓冻结保证金金额",
					key: "act_frozen",
					align: "center"
				},
				{
					title: "差值",
					key: "sub",
					align: "center",
					render: (h, params) => {
						return h("div", [
							h("div", Number(params.row.frozen_amount) - Number(params.row.act_frozen)),
						])
					}
				},
				{
					title: "策略余额",
					key: "title",
					align: "center"
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
								"修正"
							),
						]);
					}
				}
			],
			tableData: [],
			limit: 10,
			total: 1,
			page: 1,
		}
	},
	activated() {
		this.page = 1
		this.getData()
	},
	methods: {
		getData() {
			this.tableLoading = true
			let api = this.$api.errorDeal.multi_frozen_money_list
			let para = {
				limit: this.limit,
				page: this.page
			}
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.tableData = res.data.items
				this.tableLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		handlePageSize(size) {
			this.limit = size
			this.getData()
		},
		flip(page) {
			this.page = page
			this.getData()
		},
		handleEdit(row) {
			let api = this.$api.errorDeal.multi_frozen_money_manager
			this.$Modal.confirm({
				content: '<p>确认修正！？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.post(api, {
						user_id: row.id
					}).then(res => {
						this.$Message.success(res.data.message)
						this.getData()
					}).catch(err => {
						console.log('接口错误', api);
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.info('已取消');
				}
			});
		}
	}
}
</script>
<style scoped>
.table {
	margin-top: 20px;
}
</style>
