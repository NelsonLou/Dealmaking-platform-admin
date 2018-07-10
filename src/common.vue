<template lang="html">
    <div class="">
         <!-- 无搜索下拉框 -->
        <Select class="formInput" v-model="formData.agent_id" clearable>
            <Option :value='0'>否</Option>
            <Option :value='1'>是</Option>
        </Select>
        <!-- 用户搜索 变量 方法 -->
        <Select class="input left" v-model="filter.user_id" clearable placeholder="策略人" :label-in-value='true' :loading='userLoading' filterable remote :remote-method="remoteMethodUser">
 			<Option v-for='(option, index) in userList' :key='index' :value='option.id'>{{option.name}}</Option>
 		</Select>
        <!-- 代理商名称 -->
        <Select class="input left" v-model="filter.agent_id" clearable placeholder="代理商名称" :label-in-value='true' :loading='agentLoading' filterable remote :remote-method="remoteMethodAgent">
			<Option v-for='item in agentList' :key='item.id' :value='item.id'>{{item.name}}</Option>
		</Select>
        <!-- 股票搜索 -->
        <Select class="input left" v-model="filter.stock_id" clearable placeholder="股票名称" :label-in-value='true' :loading='stockLoading' filterable remote :remote-method="remoteMethodStock">
			<Option v-for='item in stockList' :key='item.id' :value='item.id'>{{item.stock_name}}</Option>
		</Select>
        <!-- 分页 -->
        <Page size="small" class="page" :total="total" :current='page' :page-size='limit' @on-page-size-change='handlePageSize' :page-size-opts='[10,20,30,40]' @on-change='flip' show-sizer show-elevator show-total></Page>
    </div>

</template>

<script>
export default {
	name: "deal",
	data() {
		return {
			limit: 10,
			page: 1,
			total: 0,
			userLoading: false,
			agentLoading: false,
			stockLoading: false,
		}
	},
	methods: {
		// 自定义弹窗
		model() {
			this.$Modal.confirm({
				content: '<p>删除该股票！？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.post(api, {
						id: row.id
					}).then(res => {
						this.$Message.success(res.data.message)
						this.handleSearch()
					}).catch(err => {
						console.log('接口错误', api);
					})
				},
				onCancel: () => {
					this.$Message.info('已取消');
				}
			});
		},
		// 用户远程搜索
		remoteMethodUser(query) {
			if (query == '') {
				this.userList = []
			} else {
				this.userList = []
				this.userLoading = true
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
		// 股票远程搜索
		remoteMethodStock(query) {
			if (query == '') {
				this.stockList = []
			} else {
				this.stockLoading = true
				this.stockList = []
				let api = this.$api.common.select_stock
				this.$axios.get(api, {
					params: {
						stock_no: query
					}
				}).then(res => {
					this.stockList = res.data
					for (let i in this.stockList) {
						this.stockList[i].id = (this.stockList[i].id).toString()
					}
					this.stockLoading = false
				}).catch(err => {
					console.log(err)
				})
			}
		},
		// 重置表单
		resetform() {
			this.$refs['formName'].resetFields();
		},
		// 提现表单
		submit() {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$axios[way](api, para).then(res => {
						this.$Message.success(res.data.message);
						this.dialog = false
						this.resetform()
						this.page = 1
						let p = {
							page: this.page,
							limit: this.limit
						}
						this.getData(p)
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
		// 修改页数据量
		handlePageSize(size) {
			this.limit = size
			this.handleSearch(1)
		},
		// 翻页
		flip(page) {
			this.page = page
			this.handleSearch(0)
		},
	}
}
</script>

<style lang="css">
</style>
feature/JNCL79-fix-searchboxErr
