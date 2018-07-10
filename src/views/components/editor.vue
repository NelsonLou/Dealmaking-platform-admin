<template>
<div>
	<textarea :id="Id"></textarea>
</div>
</template>
<script>
import './lang/zh_CN.js'
import DefaultConfig from './editor'
export default {
	data() {
		const Id = Date.now()
		return {
			DefaultConfig,
			Id: Id,
			tinyEditor: null,
			ossConfig: {},
		}
	},
	props: {
		value: {
			default: '',
			type: String
		},
		config: {
			type: Object,
			default: () => {
				return {
					theme: 'modern',
					height: 300
				}
			}
		},
		url: {
			default: '',
			type: String
		},
		accept: {
			default: 'image/png, image/jpg, image/jpeg',
			type: String
		},
		maxSize: {
			default: 2097152,
			type: Number
		},
		withCredentials: {
			default: false,
			type: Boolean
		}
	},
	mounted() {
		this.getOssConfig()
	},
	beforeDestroy() {
		// 销毁tinymce
		this.$emit('on-destroy')
		window.tinymce.remove('#' + this.Id)
	},
	methods: {
		// 初始化配置
		init() {
			const self = this
			this.tinyEditor = window.tinymce.init({
				// 默认配置
				...this.DefaultConfig,

				// 图片上传
				images_upload_handler: function(blobInfo, success, failure) {
					if (blobInfo.blob().size > self.maxSize) {
						failure('文件体积过大')
					}
					if (self.accept.indexOf(blobInfo.blob().type) >= 0) {
						uploadPic()
					} else {
						failure('图片格式错误')
					}

					function uploadPic() {
						let filetype = (blobInfo.blob().type).substring(6, (blobInfo.blob().type).length)
						let filename = (new Date()).valueOf() + '.' + filetype
						const xhr = new XMLHttpRequest()
						const formData = new FormData()

						xhr.withCredentials = self.withCredentials
						xhr.open('POST', self.ossConfig.uri)
						xhr.onload = function() {
							if (xhr.status !== 204) {
								self.$emit('on-upload-fail')
								failure('上传失败: ' + xhr.status)
								return
							}
							// 抛出 'on-upload-complete' 钩子
							var path = xhr.responseURL + 'banner/' + filename
							self.$emit('on-upload-complete', [
								path
							])
							success(path)
						}
						formData.append('key', 'banner/' + filename)
						formData.append('policy', self.ossConfig.policy)
						formData.append('signature', self.ossConfig.signature)
						formData.append('OSSAccessKeyId', self.ossConfig.access_id)
						formData.append('file', blobInfo.blob())
						xhr.send(formData)
					}
				},
				// prop内传入的的config
				...this.config,

				// 挂载的DOM对象
				selector: `#${this.Id}`,
				setup: (editor) => {
					// 抛出 'on-ready' 事件钩子
					editor.on(
						'init', () => {
							self.loading = false
							self.$emit('on-ready')
							editor.setContent(self.value)
						}
					)
					// 抛出 'input' 事件钩子，同步value数据
					editor.on(
						'input change undo redo', () => {
							self.$emit('input', editor.getContent())
						}
					)
				}
			})
		},
		// 更新富文本内容
		upDateContent(content) {
			tinyMCE.activeEditor.setContent(content)
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
			}).catch(err => {
				console.log('接口错误', api);
				console.log(err);
			})
			this.init()
		}
	}
}
</script>
