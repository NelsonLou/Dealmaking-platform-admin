<!-- 系统配置 -->
<template>
<div id="edition">
	<div class="clearfloat">
		<Select v-model="filter" class="searchTable left" placeholder='用户ID'>
            <Option v-for="item in selectData" :value="item.value" :key="item.id">{{ item.value }}</Option>
        </Select>
		<Select v-model="filter" class="searchTable left" placeholder='用户名称'>
            <Option v-for="item in selectData" :value="item.value" :key="item.id">{{ item.value }}</Option>
        </Select>
		<Button type="primary" style="margin-top:20px;float:left" class="left">查询</Button>
	</div>
	<Table :stripe="true" :loading="tableLoading" class="table" :columns="columns" :data="tableData"></Table>
	<!-- 详情弹窗 -->
	<Modal v-model="dialogInfo" class="model" width='1000' inline title="编辑">
		<span>策略编号:</span>
		<div slot='footer'>
			<Button type="primary" @click='dialogInfo = false'>确定</Button>
		</div>
	</Modal>
</div>
</template>
<script>
export default {
	name: "edition",
	data() {
		return {
			dialogInfo: false,
			columns: [{
				title: '平台',
				key: 'id',
				align: 'center'
			}, {
				title: '版本号',
				key: 'id',
				align: 'center'
			}, {
				title: '操作',
				key: 'edit',
				width: 300,
				align: 'center',
				render: (h, params) => {
					return h('div', [
						h('Button', {
							props: {
								type: 'primary',
								size: 'small'
							},
							style: {
								marginRight: '5px'
							},
							on: {
								click: () => {
									this.editRole(params.row)
								}
							}
						}, '编辑')
					]);
				}
			}],
			filter: '', // 删选数据
			selectData: [], // 筛选数据
			tableLoading: false, // 表格数据缓冲
			tableData: [{ // 表格数据
				id: 1
			}],
		}
	},
	activated() {},
	methods: {
		editRole(row) {
			console.log(row)
		},
		editPermisson(row) {
			console.log(row)
		},
		deleteRole(row) {
			console.log(row)
		},
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

.searchTable {
	width: 200px;
	margin-right: 20px;
	margin-top: 20px;
}

.model span {
	color: #797979;
	display: inline-block;
	min-width: 40%;
	font-size: 14px;
	line-height: 30px;
}
</style>
