export const SET_AUTH_USER = 'SET_AUTH_USER';
export const UNSET_AUTH_USER = 'UNSET_AUTH_USER';
export const ID_NAME = 'ID_NAME';
import * as api from '../../axios/api.js'
import axios from 'axios'
import Cookies from 'js-cookie';

const user = {
    state: {
        loginType:'',
    },
    mutations: {
        // 设置用户信息
        [SET_AUTH_USER](state, payload) {
            state.loginType = payload.user; // 登录是否成功
        },
        // 清空用户信息
        [UNSET_AUTH_USER](state) {
            state.loginType = '';
        },
    },
    actions:{
        setAuthUser({commit, dispatch},res) {
            if(res.data.type=="admin_api"){
                commit({
                    type: SET_AUTH_USER,
                    user:'admin'
                })
            }
        },
        // 清空用户信息
        unsetAuthUser({commit}) {
            commit({
                type: UNSET_AUTH_USER
            })
        },
        // 刷新token
        refreshToken({commit, dispatch}) {
            return axios.post(api.user.token_refresh).then(res => {
                dispatch('loginSuccess', res.data)
            }).catch(err => {
                dispatch('logoutRequest')
            })
        }
    }
};

export default user;
