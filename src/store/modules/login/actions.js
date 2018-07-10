import jwtToken from '../../../libs/jwt.js'
import * as api from '../../../axios/api.js'
import axios from 'axios'
import {
	Message
} from 'iview'

export default {
	// 登录
	loginRequest({
		dispatch
	}, formData) {
		return axios.post(api.user.login, formData).then(res => {
			jwtToken.setToken(res.data)
			jwtToken.setAuthId(res.data.auth_id)
			jwtToken.setWebAdminToken()
			dispatch('setAuthUser', res)
			Message.success('登陆成功！')
			return true
		}).catch(err => {
			console.log(err);
			return false
		})
	},
	// 登出
	logoutRequest({
		dispatch
	}) {
		// return axios.post(api.user.logout).then(res => {
		jwtToken.removeWebAdminToken()
		jwtToken.removeToken()
		jwtToken.removeAuthId()
		dispatch('unsetAuthUser')
		// })
	}
}