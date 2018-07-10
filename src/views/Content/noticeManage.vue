<!-- 公告管理 -->
<template>
<div id="noticeManage" style="position:relative">
	<div>
		<div class="clearfloat">
			<Input class="input left" v-model="filter.title" placeholder="标题"></Input>
			<Input class="input left" v-model="filter.publish_name" placeholder="发布人"></Input>
			<DatePicker class="input left" type="datetimerange" placeholder="变动时间" v-model='filter.time' style="width: 300px"></DatePicker>
			<Button class="left" @click='handleSearch(1)' type='primary'>查询</Button>
			<Button class="right" @click='handleAdd' type='primary'>发布公告</Button>
		</div>
		<!-- 表格 -->
		<Table class="table" :stripe="true" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
		<!-- 分页 -->
		<Page size="small" class="page" :total="total" :current='page' :page-size='limit' @on-page-size-change='handlePageSize' :page-size-opts='[10,20,30,40]' @on-change='flip' show-sizer show-elevator show-total></Page>
	</div>
	<!-- <div v-else> -->
	<Modal v-model="dialog" class="model" width="1000" :title="formTitle" @on-ok='submit' :loading='formLoading'>
		<Form :model="formData" :rules="ruleAdd" ref='formData' label-position="right" on-cancel='resetform' :label-width="100">
			<FormItem label="标题：" prop='title'>
				<Input class="input" v-model="formData.title"></Input>
			</FormItem>
			<FormItem label="发布人：" prop='publish_name'>
				<Input class="input" v-model="formData.publish_name"></Input>
			</FormItem>
			<FormItem label="发布时间：" prop='publish_at'>
				<DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" style="width: 200px" v-model='formData.publish_at'></DatePicker>
			</FormItem>
			<FormItem label="是否推送：" prop='is_push'>
				<Select class="input left" v-model="formData.is_push">
						<Option :value='0'>否</Option>
						<Option :value='1'>是</Option>
					</Select>
			</FormItem>
			<FormItem label="推送目标：" prop='push_target'>
				<Select class="input left" v-model="formData.push_target">
						<Option v-for='item in target' :value='item.value' :key='item.value'>{{item.label}}</Option>
					</Select>
			</FormItem>
			<FormItem label="内容：" prop='content'>
				<editor ref="editor" @on-upload-complete="onUploadComplete" :input='editorInput' :value='formData.content' @on-upload-fail="onUploadFail" v-model="formData.content"></editor>
			</FormItem>
		</Form>
		<Spin fix v-if='dialogLoading' size='large'></Spin>
	</Modal>
	</Modal>
	<!-- 内容预览 -->
	<Modal v-model="previewDialog" class="model" width="1000" title="预览">
		<div class="" v-html='formData.content'></div>
		<Spin fix v-if='dialogLoading' size='large'></Spin>
	</Modal>
</div>
</template>
<script>
import editor from '../components/editor.vue'
export default {
	name: "noticeManage",
	data() {
		return {
			target: [{
					value: 'ios',
					label: 'ios',
				},
				{
					label: 'android',
					value: 'android'
				},
				{
					label: '全部',
					value: 'all'
				}
			],
			content: '',
			tableLoading: false,
			formLoading: true,
			userLoading: false,
			dialogLoading: false,
			ruleAdd: {},
			action: '',
			userList: [],
			formTitle: 'xx',
			tableData: [],
			dialog: false,
			previewDialog: false,
			total: 1,
			page: 1,
			limit: 10,
			formData: {
				title: '',
				is_push: '',
				publish_name: '',
				push_target: '',
				publish_at: '',
				content: '',
			},
			filter: {
				title: '',
				time: [],
				publish_name: ''
			},
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
				},
				{
					title: "发布时间",
					key: "publish_at",
					align: "center"
				},
				{
					title: "发布人",
					key: "publish_name",
					align: "center"
				},
				{
					title: "创建人",
					key: "created_admin",
					align: "center",
					render: (h, params) => {
						return h("div", [
							h("div", params.row.created_admin.name),
						])
					}
				},
				{
					title: "状态",
					key: "status",
					align: "center",
					render: (h, params) => {
						return h("div", [
							h("div", params.row.status == 0 ? '禁用' : '有效'),
						])
					}
				},
				{
					title: "是否推送",
					key: "is_push",
					align: "center",
					render: (h, params) => {
						return h("div", [
							h("div", params.row.is_push == 0 ? '否' : '是'),
						])
					}
				},
				{
					title: "推送目标",
					key: "push_target",
					align: "center",
					render: (h, params) => {
						return h("div", [
							h("div", params.row.push_target == 'all' ? '全部' : params.row.push_target),
						])
					}
				},
				{
					title: "操作",
					key: "action",
					width: 250,
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
											this.handleEdit(params.row);
										}
									}
								},
								"编辑"
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
								"内容预览"
							),
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
							// 禁用
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
											this.handleDisable(params.row);
										}
									}
								},
								params.row.status == 0 ? '恢复' : '禁用'
							)
						]);
					}
				}
			]
		}
	},
	components: {
		'editor': editor
	},
	activated() {
		this.page = 1
		let para = {
			page: this.page,
			limit: this.limit
		}
		this.getData(para)
	},
	methods: {
		// 获取数据
		getData(para) {
			this.tableLoading = true
			let api = this.$api.content.notices
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.tableData = res.data.items
				this.tableLoading = false
				this.total = res.data.total
			}).catch(err => {
				console.log(err);
			})
		},
		// 翻页
		flip(page) {
			this.page = page
			this.handleSearch(0)
		},
		// 修改页大小
		handlePageSize(size) {
			this.limit = size
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
			this.page = 1
			let para = {
				title: this.filter.title,
				publish_name: this.filter.publish_name,
				start_time: start_time,
				end_time: end_time,
				page: this.page,
				limit: this.limit
			}
			this.getData(para)
		},
		// 变价
		handleEdit(row) {
			this.dialog = true
			this.dialogLoading = true
			this.action = 'edit'
			let api = this.$api.content.notice
			let para = {
				id: row.id
			}
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.formData = res.data
				this.$refs.editor.upDateContent(this.formData.content)
				this.dialogLoading = false
			}).catch(err => {
				console.log('接口错误', api);
				console.log(err);
			})
		},
		// 添加
		handleAdd() {
			this.resetform()
			this.action = 'add'
			this.formTitle = '添加公告'
			this.$refs.editor.upDateContent(this.formData.content)
			this.dialog = true
		},
		// 删除
		handleDelete(row) {
			this.$Modal.confirm({
				content: '<p>确定删除公告！？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					let api = this.$api.content.media_destroy
					this.$axios.post(api, {
						id: row.id
					}).then(res => {
						this.$Message.success(res.data.message)
						this.handleSearch(0)
					}).catch(err => {
						console.log('接口错误' + api);
					})
				}
			});
		},
		// 预览
		handlePreview(row) {
			this.previewDialog = true
			this.dialogLoading = true
			this.action = 'edit'
			let api = this.$api.content.notice
			let para = {
				id: row.id
			}
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.formData = res.data
				this.dialogLoading = false
			}).catch(err => {
				console.log('接口错误', api);
				console.log(err);
			})
		},
		// 禁用
		handleDisable(row) {
			let para = {
				id: row.id
			}
			let api = row.status == '1' ? this.$api.content.media_disable : this.$api.content.media_enable
			this.$Modal.confirm({
				content: row.status == '1' ? '<p>禁用该公告！？</p>' : '<p>恢复该公告！？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.post(api, para).then(res => {
						this.$Message.success('已生效！')
						this.page = 1
						let para = {
							page: this.page,
							limit: this.limit,
						}
						this.getData(para)
					}).catch(err => {
						console.log('接口错误' + api);
						console.log(err);
					})
				}
			});
		},
		// 重置表单
		resetform() {
			this.$refs.formData.resetFields();
		},
		// 提交表单
		submit() {
			this.dialogLoading = true
			var api = ''
			var para = {}
			let time = this.formData.publish_at == null ? '' : this.formData.publish_at == '' ? '' : this.handletimer(this.formData.publish_at)
			if (this.action == 'add') {
				api = this.$api.content.notices_create
				para = {
					title: this.formData.title,
					is_push: this.formData.is_push,
					publish_name: this.formData.publish_name,
					push_target: this.formData.push_target,
					publish_at: time,
					content: this.formData.content,
				}
			} else {
				api = this.$api.content.notices_edit
				para = {
					id: this.formData.id,
					title: this.formData.title,
					is_push: this.formData.is_push,
					publish_name: this.formData.publish_name,
					push_target: this.formData.push_target,
					publish_at: time,
					content: this.formData.content,
				}
			}
			this.$refs.formData.validate((valid) => {
				if (valid) {
					this.$axios.post(api, para).then(res => {
						this.dialogLoading = false
						this.$Message.success(res.data.message);
						this.dialog = false
						this.resetform()
						this.page = 1
						let p = {
							page: this.page,
							limit: this.limit
						}
						this.getData(p)
					}).catch(err => {
						this.dialogLoading = false
						console.log(err);
					})
				} else {
					return this.changeLoading();
				}
			})
		},
		// 修改表单loading状态
		changeLoading() {
			this.formLoading = false;
			this.$nextTick(() => {
				this.formLoading = true;
			});
		},
		// 获取时间格式
		handletimer(date) {
			let eyear = date.getFullYear()
			let emonth = Number(date.getMonth()) + 1
			let eday = date.getDate()
			let ehours = date.getHours()
			let eminutes = date.getMinutes()
			let esecond = date.getSeconds()
			return eyear + '-' + emonth + '-' + eday + ' ' + ehours + ':' + eminutes + ':' + esecond
		},
		// 图片上传完成回调
		onUploadComplete(path, success) {
			this.formData.banner = path[0]
			this.formData.banner = path[0]
		},
		// 图片上传失败回调
		onUploadFail() {
			this.$Message.error('图片上传失败！请刷新浏览器后重新上传。')
		},
		editorInput(res) {
			console.log(res);
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
