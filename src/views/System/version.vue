<template>
<div id="version">
	<Table style="marginTop:20px;" :stripe="true" :loading="tableLoading" class="table" :columns="columns" :data="tableData"></Table>
	<!-- 弹窗 -->
	<Modal v-model="dialog" :loading='formLoading' class="model" width="1000" title="编辑" @on-ok="submit">
		<!-- 修改表单 -->
		<Form :model="formData" :rules="formRule" ref='formData' label-position="right" :label-width="100">
			<FormItem label="版本类型：" prop='client_type'>
				<Select class="formInput" v-model="formData.client_type" :disabled='true'>
					<Option v-for='item in typeArray' :key='item.value'  :value="item.value">{{item.label}}</Option>
				</Select>
			</FormItem>
			<FormItem label="版本号：" prop='version'>
				<Input class="formInput" v-model="formData.version"></Input>
			</FormItem>
			<FormItem label="是否提示更新：" prop='is_update'>
				<Select class="formInput" v-model="formData.is_update">
					<Option v-for='item in selectArray' :key='item.value' :value="item.value">{{item.label}}</Option>
				</Select>
			</FormItem>
			<FormItem label="是否直接下载：" prop='is_download'>
				<Select class="formInput" v-model="formData.is_download">
					<Option v-for='item in selectArray' :key='item.value' :value="item.value">{{item.label}}</Option>
				</Select>
			</FormItem>
			<FormItem label="下载地址：" prop='update_url'>
				<Input class="formInput" type='textarea' v-model='formData.update_url'></Input>
			</FormItem>
			<FormItem label="版本描述：" prop='description'>
				<Input class="formInput" type='textarea' v-model='formData.description'></Input>
			</FormItem>
		</Form>
		<Spin v-if='modelLoading' fix size='large'></Spin>
	</Modal>
</div>
</template>
<script>
export default {
	name: "version",
	data() {
		return {
			selectArray: [{
				value: 1,
				label: '是',
			}, {
				value: 0,
				label: '否',
			}],
			typeArray: [{
				value: 1,
				label: 'IOS',
			}, {
				value: 0,
				label: 'Android',
			}],
			dialog: false,
			columns: [{
					title: "版本类型",
					key: "client_type",
					align: "center"
				},
				{
					title: "版本号",
					key: "version",
					align: "center"
				},
				{
					title: "是否提示更新",
					key: "is_update",
					align: "center"
				},
				{
					title: "是否直接下载",
					key: "is_download",
					align: "center"
				},
				{
					title: "下载地址",
					key: "update_url",
					align: "center",
					width: 250,
				},
				{
					title: "版本描述",
					key: "description",
					align: "center",
					width: 250,
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
								"编辑"
							),
						]);
					}
				}
			],
			tableData: [],
			tableLoading: false,
			modelLoading: false,
			formLoading: true,
			formRule: {},
			formData: {
				id: '',
				client_type: '',
				version: '',
				is_update: '',
				is_download: '',
				update_url: '',
				description: '',
				created_at: '',
				updated_at: '',
			}
		}
	},
	activated() {
		this.tableData = [{
			point: 1,
		}]
		this.getData()
	},
	methods: {
		getData() {
			this.tableLoading = true
			let api = this.$api.system.versions
			this.$axios.get(api).then(res => {
				this.tableData = res.data.items
				this.tableLoading = false
			}).catch(err => {
				console.log('接口错误', api);
				console.log(err);
			})
		},
		handleEdit(row) {
			this.modelLoading = true
			this.dialog = true
			let api = this.$api.system.version
			let para = {
				id: row.id
			}
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.formData = res.data.data
				this.modelLoading = false
			}).catch(err => {
				console.log('接口错误', api);
				console.log(err);
			})
		},
		submit() {
			var api = this.$api.system.version_update
			var para = this.formData
			this.$refs.formData.validate((valid) => {
				if (valid) {
					this.$axios.post(api, para).then(res => {
						this.$Message.success(res.data.message);
						this.dialog = false
						this.handleReset('formData')
						this.page = 1
						let para = {
							limit: this.limit,
							page: this.page
						}
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
		handleReset(name) {
			this.$refs[name].resetFields();
		},
		changeLoading() {
			this.formLoading = false;
			this.$nextTick(() => {
				this.formLoading = true;
			});
		},
	}
}
</script>
<style scoped>
</style>
