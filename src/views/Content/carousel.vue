<!-- 首页轮播 -->
<template>
<div id="carousel" style="position:relative">
	<!-- 操作栏 -->
	<div class="clearfloat">
		<Button class="left" @click='handleSearch(1)' type='primary'>查询</Button>
		<Button class="left marginLeft" @click='handleAdd' type='primary'>添加</Button>
		<!-- <Button class="right" @click='' type='primary'>导出</Button> -->
	</div>
	<!-- 搜索框 -->
	<div class="clearfloat marginTop">
		<DatePicker class="input left" type="datetimerange" placeholder="发布时间" v-model='filter.time' style="width: 300px"></DatePicker>
		<Input class="input left" v-model="filter.title" placeholder="标题"></Input>
		<Input class="input left" v-model="filter.publish_name" placeholder="发布人"></Input>
	</div>
	<!-- 表格 -->
	<Table class="table" :stripe="true" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
	<!-- 分页 -->
	<Page size="small" class="page" :total="total" :current='page' :page-size='limit' @on-page-size-change='handlePageSize' :page-size-opts='[10,20,30,40]' @on-change='flip' show-sizer show-elevator show-total></Page>
	<!-- 弹窗 -->
	<Modal v-model="dialog" class="model" width="1000" :title="formTitle" @on-ok='submit' :loading='formLoading'>
		<!-- 编辑表单 -->
		<Form :model="formData" :rules="formRule" ref='formData' label-position="right" :label-width="100">
			<FormItem label="标题：" prop='title'>
				<Input class="input" v-model="formData.title"></Input>
			</FormItem>
			<FormItem label="发布人：" prop='publish_name'>
				<Input class="input" v-model="formData.publish_name"></Input>
			</FormItem>
			<!-- 			<FormItem label="是否推送：" prop='is_push'>
				<Select class="input left" clearable v-model="formData.is_push">
					<Option :value='1'>是</Option>
					<Option :value='0'>否</Option>
				</Select>
			</FormItem>
			<FormItem label="推送目标：" prop='push_target'>
				<Select class="input left" clearable v-model="formData.push_target">
					<Option :value='0'>IOS</Option>
					<Option :value='1'>Android</Option>
					<Option :value='2'>全部</Option>
				</Select>
			</FormItem> -->
			<FormItem label="发布时间：" prop='publish_at'>
				<DatePicker type="datetime" style="width: 200px" v-model='formData.publish_at'></DatePicker>
			</FormItem>
			<FormItem label="图片：" prop=''>
				<img style="width:200px;height:200px" :src="formData.banner" alt="">
				<Upload :action="ossConfig.uri" :show-upload-list='false' :data='imgData' :on-success='imgUpLoadSuccess' :before-upload='imgUpLoadBefore'>
					<Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
				</Upload>
			</FormItem>
			<FormItem label="图片地址：" prop='banner'>
				<Input class="input" :disabled='true' v-model="formData.banner"></Input>
			</FormItem>
			<FormItem label="点击跳转url：" prop='url'>
				<Input class="input" v-model="formData.uri"></Input>
			</FormItem>
			<!-- 			<editor ref="editor" @on-upload-complete= "onUploadComplete" @on-upload-fail= "onUploadFail" v-model="formData.content"></editor> -->
			<!-- <Input class="input left" v-model="formData.content"></Input> -->
		</Form>
		<Spin v-if='modelLoading' fix size='large'></Spin>
	</Modal>
</div>
</template>
<script>
// import editor from '../components/editor'
export default {
	name: "carousel",
	data() {
		// 通用验证
		const valiCommon = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('该项为必填'));
			} else {
				callback();
			}
		};
		return {
			imgList: [],
			imgData: {},
			action: '',
			userList: [],
			fileName: '',
			selectLoading: false,
			tableLoading: false,
			formLoading: true,
			tableData: [],
			formRule: {
				title: [{
					validator: valiCommon,
					trigger: 'blur'
				}],
				// is_push: [{
				// 	validator: valiCommon,
				// 	trigger: 'blur'
				// }],
				// publish_name: [{
				// 	validator: valiCommon,
				// 	trigger: 'blur'
				// }],
				// content: [{
				// 	validator: valiCommon,
				// 	trigger: 'blur'
				// }],
				banner: [{
					validator: valiCommon,
					trigger: 'blur'
				}],
				// push_target: [{
				// 	validator: valiCommon,
				// 	trigger: 'blur'
				// }],
				// publish_at: [{
				// 	validator: valiCommon,
				// 	trigger: 'blur'
				// }]
			},
			modelLoading: false,
			formTitle: '',
			dialog: false,
			page: 1,
			total: 1,
			limit: 10,
			withdraw_status: [],
			formData: { // 表单文件
				title: '', // 轮播标题
				// is_push: '', // 是否推送
				publish_name: '', // 发布人
				// push_target: '',// 推送目标
				publish_at: '', // 发布时间
				// content: '',// 发布内容
				banner: '', // 图片地址
				uri: '', // 轮播地址
			},
			filter: { // 筛选时间
				time: '',
				publish_name: '',
				title: '',
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
					align: "center",
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
				// {
				// 	title: "是否推送",
				// 	key: "is_push",
				// 	align: "center",
				// 	render: (h, params) => {
				// 		return h("div", [
				// 			h("div", params.row.is_push==0?'否':'是'),
				// 		])
				// 	}
				// },
				// {
				// 	title: "推送目标",
				// 	key: "push_target",
				// 	align: "center",
				// 	render: (h, params) => {
				// 		return h("div", [
				// 			h("div", params.row.is_push==0?'ios':'android'),
				// 		])
				// 	}
				// },
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
							),
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
											this.handlePic(params.row);
										}
									}
								},
								"查看图片"
							)
						]);
					}
				}
			],
			ossConfig: {
				uri: '',
				signature: '',
				access_id: '',
				policy: '',
			},
		}
	},
	// components: {
	// 	'editor': editor
	// },
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
			let api = this.$api.content.banners
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.total = res.data.total
				this.tableData = res.data.items
				this.tableLoading = false
			}).catch(err => {
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
				content: row.status == '1' ? '<p>禁用该轮播！？</p>' : '<p>恢复该轮播！？</p>',
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
		// 添加
		handleAdd() {
			this.resetform()
			this.action = 'add'
			this.formTitle = '添加轮播'
			this.dialog = true
			this.modelLoading = true
			this.getOssConfig()
		},
		// 编辑
		handleEdit(row) {
			this.dialog = true
			this.modelLoading = true
			this.resetform()
			this.formTitle = '编辑'
			this.action = 'edit'
			let api = this.$api.content.banner
			let para = {
				id: row.id
			}
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.formData = res.data
				this.getOssConfig()
			}).catch(err => {
				console.log('接口错误', api);
				console.log(err);
			})
		},
		// 删除
		handleDelete(row) {
			let api = this.$api.content.media_destroy
			let para = {
				id: row.id
			}
			this.$Modal.confirm({
				content: '<p>删除该轮播！？</p>',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$axios.post(api, para).then(res => {
						this.$Message.success('已删除！')
						let para = {
							page: 1,
							limit: this.limit,
						}
						this.getData(para)
					}).catch(err => {
						console.log('接口错误' + api);
					})
				}
			});
		},
		// 预览图片
		handlePic(row) {
			let api = this.$api.content.banner
			let para = {
				id: row.id
			}
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.$Modal.info({
					content: '<img style="width:200px;height:200px" src=' + res.data.banner + '>',
					okText: '确定',
					onOk: () => {}
				});
			}).catch(err => {
				console.log('接口错误', api);
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
			let para = {
				title: this.filter.status,
				publish_name: this.filter.publish_name,
				start_time: start_time,
				end_time: end_time,
				page: this.page,
				limit: this.limit
			}
			this.getData(para)
		},
		// 交互
		submit() {
			let para = {}
			let api = ''
			let time = this.formData.publish_at == null ? '' : this.formData.publish_at == '' ? '' : this.handletimer(this.formData.publish_at)
			if (this.action == 'add') {
				api = this.$api.content.banners_create
				para = {
					title: this.formData.title,
					// is_push: this.formData.is_push,
					publish_name: this.formData.publish_name,
					// push_target: this.formData.push_target,
					publish_at: time,
					// content: this.formData.content,
					// banner: this.formData.banner,
					banner: this.formData.banner,
					uri: this.formData.uri,
				}
			} else {
				api = this.$api.content.banners_edit
				para = {
					id: this.formData.id,
					title: this.formData.title,
					// is_push: this.formData.is_push,
					publish_name: this.formData.publish_name,
					// push_target: this.formData.push_target,
					publish_at: time,
					// content: this.formData.content,
					banner: this.formData.banner,
					uri: this.formData.uri,
				}
			}
			this.$refs['formData'].validate((valid) => {
				if (valid) {
					this.$axios.post(api, para).then(res => {
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
		// 重置表单
		resetform() {
			this.$refs.formData.resetFields();
		},
		// 改变loading状态
		changeLoading() {
			this.formLoading = false;
			this.$nextTick(() => {
				this.formLoading = true;
			});
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
		// 用户远程搜索
		remoteMethodUser(query) {
			if (query !== '') {
				this.selectLoading = true;
				setTimeout(() => {
					this.userList = []
					let api = this.$api.common.select_user
					this.$axios.get(api, {
						params: {
							user_param: query
						}
					}).then(res => {
						this.userList = []
						for (let i = 0; i < res.data.length; i++) {
							this.userList.push({
								id: (res.data[i].id).toString(),
								name: res.data[i].name == null ? res.data[i].mobile : res.data[i].name,
							})
						}
						this.selectLoading = false;
					}).catch(err => {
						console.log(err)
					})
				}, 200);
			} else {
				this.userList = []
			}
		},
		// 获取oss配置
		getOssConfig() {
			let api = this.$api.common.oss_key_post
			let para = {
				object: 'banner'
			}
			this.$axios.get(api, {
				params: para
			}).then(res => {
				this.ossConfig = res.data
				this.fileName = (new Date()).valueOf()
				this.imgData.policy = this.ossConfig.policy,
					this.imgData.signature = this.ossConfig.signature,
					this.imgData.OSSAccessKeyId = this.ossConfig.access_id,
					this.modelLoading = false
			}).catch(err => {
				console.log('接口错误', api);
				console.log(err);
			})
		},
		// 图片上传前回调
		imgUpLoadBefore(file) {
			let filetype = file.type.substring(6, file.type.length)
			this.fileName = this.fileName + '.' + filetype
			this.imgData.key = 'banner/' + this.fileName
			console.log(this.imgData.key);
		},
		// 上传成功回调
		imgUpLoadSuccess(response, file, fileList) {
			this.formData.banner = this.ossConfig.uri + '/banner/' + this.fileName
		},
		// 富文本
		// onUploadComplete(path,success){
		// 		this.formData.banner = path[0]
		// 	this.formData.banner = path[0]
		// },
		// onUploadFail(){
		// 	console.log('上传失败');
		// }
	},
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
	float: right;
	margin-top: 20px;
	margin-bottom: 20px;
}

.box {
	width: 50%;
}

.red {
	color: red,
}

.green {
	color: green,
}
</style>
