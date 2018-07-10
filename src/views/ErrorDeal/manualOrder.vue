<!-- 重复结算 -->
<template>
<div id="manualOrder" style="position:relative">
	<div class="clearfloat">
		<Button type="primary" class="left" @click='refreshData'>刷新</Button>
	</div>
	<Table class="table" :stripe="true" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
	<Page size="small" class="page" :total="total" :current='page' :page-size='limit' @on-page-size-change='handlePageSize' :page-size-opts='[10,20,30,40]' @on-change='flip' show-sizer show-elevator show-total></Page>
</div>
</template>
<script>
export default {
	name: "manualOrder",
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
					key: "name",
					align: "center"
				},
				{
					title: "策略编号",
					key: "policy_no",
					width: 200,
					align: "center",
				},
				{
					title: "策略余额",
					key: "available_balance",
					align: "center"
				},
				{
					title: "钱包余额",
					key: "wallet_amount",
					align: "center"
				},
				{
					title: "多返回金额",
					key: "all_return_amount",
					align: "center"
				},
				{
					title: "结算次数",
					key: "count",
					align: "center",
				},
				{
					title: "手机号",
					key: "mobile",
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
			let api = this.$api.errorDeal.repeat_settlement_list
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
				console.log('接口错误', api);
				console.log(err);
			})
		},
		refreshData() {
			this.page = 1
			this.getData()
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
			let api = this.$api.errorDeal.repeat_settlement_manager
			this.$Modal.confirm({
				content: '<p>确认修正！？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.post(api, {
						policy_id: row.id
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
</style>
