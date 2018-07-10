import Cookie from 'js-cookie'
export default {
	// 将token存储在本地
	setToken(data) {
		let time = data.expires_in / 3600 / 24
		Cookie.set('admin_token', data.token, {
			expires: time
		});
	},
	// 获取存储在本地token
	getToken() {
		return Cookie.get('admin_token')
	},
	// 清除token
	removeToken() {
		return Cookie.remove('admin_token')
	},
	// 将用户auth_id存储在cookie
	setAuthId(authId) {
		Cookie.set('auth_id', authId);
	},
	// 清除auth_id
	removeAuthId() {
		return Cookie.remove('auth_id');
	},
	// 设置前端token
	setWebAdminToken() {
		let token = (new Date()).getTime()
		let time = 1 / 24 / 2
		Cookie.set('admin_web_token', token, {
			expires: time
		});
	},
	// 获取web Token
	getWebAdminToken() {
		return Cookie.get('admin_web_token')
	},
	// 获取web Token
	removeWebAdminToken() {
		return Cookie.remove('admin_web_token');
	}
}