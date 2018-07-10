import axios from 'axios';
import semver from 'semver';
import packjson from '../../package.json';

let util = {};

//
util.inOf = function(arr, targetArr) {
	let res = true;
	arr.forEach(item => {
		if (targetArr.indexOf(item) < 0) {
			res = false;
		}
	});
	return res;
};

//
util.oneOf = function(ele, targetArr) {
	if (targetArr.indexOf(ele) >= 0) {
		return true;
	} else {
		return false;
	}
};

//
util.showThisRoute = function(itAccess, currentAccess) {
	if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
		return util.oneOf(currentAccess, itAccess);
	} else {
		return itAccess === currentAccess;
	}
};

//
util.getRouterObjByName = function(routers, name) {
	if (!name || !routers || !routers.length) {
		return null;
	}
	// debugger;
	let routerObj = null;
	for (let item of routers) {
		if (item.name === name) {
			return item;
		}
		routerObj = util.getRouterObjByName(item.children, name);
		if (routerObj) {
			return routerObj;
		}
	}
	return null;
};

util.setCurrentPath = function(vm, name) {
	let title = '';
	let isOtherRouter = false;
	// 比对路由内的name
	vm.$store.state.app.routers.forEach(item => {
		// 判断子路由长度
		if (item.children.length === 1) {
			// 假如只有一个子路由 判断是否和当前路由相同
			if (item.children[0].name === name) {
				// 变量title赋值为选中的父级录用title
				title = item.title;
				// 假如是otherRouter
				if (item.name === 'otherRouter') {
					isOtherRouter = true;
				}
			}
		} else {
			item.children.forEach(child => {
				if (child.name === name) {
					title = child.title;
					if (item.name === 'otherRouter') {
						isOtherRouter = true;
					}
				}
			});
		}
	});
	let currentPathArr = [];
	// 假如当前页为首页
	if (name === 'home_index') {
		currentPathArr = [{
			title: util.getRouterObjByName(vm.$store.state.app.routers, 'home_index').title,
			path: '',
			name: 'home_index'
		}];
	} else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
		currentPathArr = [{
				title: util.getRouterObjByName(vm.$store.state.app.routers, 'home_index').title,
				path: '/home',
				name: 'home_index'
			},
			{
				title: title,
				path: '',
				name: name
			}
		];
	} else {
		let currentPathObj = vm.$store.state.app.routers.filter(item => {
			if (item.children.length <= 1) {
				return item.children[0].name === name;
			} else {
				let i = 0;
				let childArr = item.children;
				let len = childArr.length;
				while (i < len) {
					if (childArr[i].name === name) {
						return true;
					}
					i++;
				}
				return false;
			}
		})[0];
		if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
			currentPathArr = [{
				title: '首页',
				path: '',
				name: 'home_index'
			}];
		} else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
			currentPathArr = [{
					title: '首页',
					path: '/home',
					name: 'home_index'
				},
				{
					title: currentPathObj.title,
					path: '',
					name: name
				}
			];
		} else {
			let childObj = currentPathObj.children.filter((child) => {
				return child.name === name;
			})[0];
			currentPathArr = [{
					title: '首页',
					path: '/home',
					name: 'home_index'
				},
				{
					title: currentPathObj.title,
					path: '',
					name: currentPathObj.name
				},
				{
					title: childObj.title,
					path: currentPathObj.path + '/' + childObj.path,
					name: name
				}
			];
		}
	}
	vm.$store.commit('setCurrentPath', currentPathArr);
	return currentPathArr;
};

// 打开新页面
util.openNewPage = function(vm, name, argu, query) {
	let pageOpenedList = vm.$store.state.app.pageOpenedList;
	let openedPageLen = pageOpenedList.length;
	let i = 0;
	let tagHasOpened = false;
	while (i < openedPageLen) {
		if (name === pageOpenedList[i].name) { // 页面已经打开
			vm.$store.commit('pageOpenedList', {
				index: i,
				argu: argu,
				query: query
			});
			tagHasOpened = true;
			break;
		}
		i++;
	}
	if (!tagHasOpened) {
		let tag = vm.$store.state.app.tagsList.filter((item) => {
			if (item.children) {
				return name === item.children[0].name;
			} else {
				return name === item.name;
			}
		});
		tag = tag[0];
		if (tag) {
			tag = tag.children ? tag.children[0] : tag;
			if (argu) {
				tag.argu = argu;
			}
			if (query) {
				tag.query = query;
			}
			vm.$store.commit('increateTag', tag);
		}
	}
	vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function(routers, name, route, next) {
	let len = routers.length;
	let i = 0;
	let notHandle = true;
	while (i < len) {
		if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
			route.replace({
				name: routers[i].children[0].name
			});
			notHandle = false;
			next();
			break;
		}
		i++;
	}
	if (notHandle) {
		next();
	}
};

export default util;