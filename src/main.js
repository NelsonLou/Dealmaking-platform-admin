import Vue from 'vue';
import iView from 'iview';
import {
  router
} from './router/index';
import {
  appRouter
} from './router/router';
import store from './store';
import App from './app.vue';

// 引入iview
import 'iview/dist/styles/iview.css';
import {
  Message
} from 'iview'
import VueI18n from 'vue-i18n';

// 引入常用配置函数
import util from './libs/util';

// 引入cookie
import cookie from 'js-cookie'

// 引入token方法
import jwtToken from './libs/jwt'
Vue.prototype.$jwtToken = jwtToken

// api 常量引入
import * as api from './axios/api.js'
Vue.prototype.$api = api

// 引入axios 及配置
import axios from 'axios'
Vue.prototype.$axios = axios

// 映入js-file-download
import jsfiledownload from 'js-file-download'
Vue.prototype.$jsfiledownload = jsfiledownload

// 引入基础样式
import './styles/base.css'

// 引入mockjs
// import mock from 'mockjs'
// require('./mock/mock')

Vue.use(VueI18n);
Vue.use(iView);

axios.defaults.baseURL = api.config.url

// 请求拦截器
axios.interceptors.request.use(function(config) {
  // 验证后台token是否过期
  if (jwtToken.getToken()) {
    // 验证前端token是否过期
    if (jwtToken.getWebAdminToken()) {
      config.headers['Authorization'] = "Bearer " + jwtToken.getToken();
      jwtToken.setWebAdminToken()
    } else {
      store.dispatch("logoutRequest");
      store.commit('clearOpenedSubmenu');
      router.push({
        name: 'login'
      });
    }
  } else if (config.url != api.user.login && !jwtToken.getToken()) {
    store.dispatch("logoutRequest");
    store.commit('clearOpenedSubmenu');
    router.push({
      name: 'login'
    });
  }
  return config;
}, function(err) {
  return promise.reject(err);
})

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
  return response
}, function(error) {
  console.log(error);
  if (error.response != undefined) {
    Message.error(error.response.data.message)
  } else {
    Message.error('网络异常或登录失效！')
  }　
  return Promise.reject(error.response)
});

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App),
  data: {
    currentPageName: ''
  },
  mounted() {
    this.currentPageName = this.$route.name;
    // 显示打开的页面的列表
    this.$store.commit('setOpenedList');
    this.$store.commit('initCachepage');
    // 权限菜单过滤相关
    this.$store.commit('updateMenulist');
  },
  created() {
    let tagsList = [];
    appRouter.map((item) => {
      if (item.children.length <= 1) {
        tagsList.push(item.children[0]);
      } else {
        tagsList.push(...item.children);
      }
    });
    this.$store.commit('setTagsList', tagsList);
  }
});