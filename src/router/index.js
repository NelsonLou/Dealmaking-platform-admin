import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import {
	Message
} from 'iview'
import Cookies from 'js-cookie';
import jwtToken from '../libs/jwt'
import {
	routers,
	otherRouter,
	appRouter
} from './router';
// import {routers, otherRouter, appRouter} from './agentsRouter';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
	// mode: 'history',
	routes: routers
};

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
	iView.LoadingBar.start();
	if ((jwtToken.getToken() == null) && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
		Message.error('登录失效请重新登陆！')
		next({
			name: 'login'
		});
	} else if (jwtToken.getToken() != null && to.name === 'login') { // 判断是否已经登录且前往的是登录页
		next({
			name: 'home_index'
		});
	} else {
		const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
		Util.toDefaultPage([...routers], to.name, router, next);
	}
});

router.afterEach((to) => {
	Util.openNewPage(router.app, to.name, to.params, to.query);
	iView.LoadingBar.finish();
	window.scrollTo(0, 0);
});