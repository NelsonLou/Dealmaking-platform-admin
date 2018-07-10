<!-- 验证码 -->
<template>
<div id="verification" style="position:relative">
	<!-- 搜索框 -->
	<div class="clearfloat">
		<Select clearable class="input left" v-model="filter.is_used" placeholder="状态">
            <Option :value='0'>未使用</Option>
            <Option :value='1'>已使用</Option>
        </Select>
		<Select clearable class="input left" v-model="filter.type" placeholder="短信类型">
            <Option :value='1'>注册</Option>
            <Option :value='2'>忘记密码</Option>
            <Option :value='3'>设置/忘记提现密码</Option>
        </Select>
		<Input clearable class="input left" v-model="filter.mobile" placeholder="手机号"></Input>
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
	name: "verification",
	data: () => ({
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
			is_used: '',
			type: '',
			mobile: ''
		},
		columns: [{ // 表格配置项
				type: 'index',
				width: 60,
				title: "No",
				align: "center"
			},
			{
				title: "手机号",
				key: "mobile",
				align: "center"
			}, {
				title: "验证码",
				key: "code",
				align: "center"
			}, {
				title: "类型",
				key: "type",
				align: "center"
			}, {
				title: "状态",
				key: "is_used",
				align: "center"
			}, {
				title: "时间",
				key: "created_at",
				align: "center"
			}
		]
	}),
	activated() {
		this.page = 1
		let para = {
			limit: this.limit,
			page: this.page
		}
		this.getData(para)
	},
	methods: {
		getData(para) {
			this.tableLoading = true
			let api = this.$api.userManage.users_code
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.tableData = res.data.items
				this.total = res.data.total
				for (let i = 0; i < this.tableData.length; i++) {
					this.tableData[i].is_used = res.data.items[i].is_used == 1 ? '已使用' : '未使用'
					this.tableData[i].type = res.data.items[i].type == 1 ? '注册' : res.data.items[i].type == 2 ? '忘记密码' : res.data.items[i].type == 3 ? '用户设置提现密码' : '代理商二级密码修改'
				}
				this.tableLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		flip(page) {
			this.page = page
			this.handleSearch(0)
		},
		handlePageSize(size) {
			this.limit = size
			this.handleSearch(1)
		},
		handleSearch(count) {
			if (count == 1) {
				this.page = 1
			}
			let para = {
				is_used: this.filter.is_used,
				mobile: this.filter.mobile,
				type: this.filter.type,
				limit: this.limit,
				page: this.page,
			}
			this.getData(para)
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
