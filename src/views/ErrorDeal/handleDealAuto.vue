<!-- 自动递延手动执行 -->
<template>
<div id="">
	<Card class="card">
		<span>开始执行操作说明：可执行时间为 14:39-15:00</span>
		<Button size='large' class="btn" type='primary' @click='SBfunction'>开始执行</Button>
	</Card>
</div>
</template>
<script>
export default {
	name: "",
	data: () => ({}),
	methods: {
		SBfunction() {
			let api = this.$api.errorDeal.auto_deferred_manual
			this.$Modal.confirm({
				content: '<p>确认执行！？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.post(api).then(res => {
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
		}
	}
}
</script>
<style scoped>
.card {
	text-align: center;
}

.btn {
	display: block;
	width: 50%;
	margin-top: 30px;
	margin-left: 25%;
}
</style>
