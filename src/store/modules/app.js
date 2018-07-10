import {
	otherRouter,
	appRouter
} from '@/router/router';
import Util from '@/libs/util';
import Cookies from 'js-cookie';
import Vue from 'vue';

const app = {
	state: {
		cachePage: [],
		lang: '',
		// 左侧展开菜单列表
		openedSubmenuArr: [],
		menuTheme: 'dark', // 主题
		themeColor: '',
		// 頂部打開的tag
		pageOpenedList: [{
			title: '首页',
			path: '',
			name: 'home_index'
		}],
		currentPageName: '',
		currentPath: [{
			title: '首页',
			path: '',
			name: 'home_index'
		}],
		menuList: [],
		routers: [
			otherRouter,
			...appRouter
		],
		tagsList: [...otherRouter.children],
		dontCache: [] // 定义不缓存页面name属性值
	},
	mutations: {
		// 设置tag
		setTagsList(state, list) {
			state.tagsList.push(...list);
		},
		updateMenulist(state) {
			let accessCode = parseInt(Cookies.get('access'));
			let menuList = [];
			appRouter.forEach((item, index) => {
				if (item.access !== undefined) {
					if (Util.showThisRoute(item.access, accessCode)) {
						if (item.children.length === 1) {
							menuList.push(item);
						} else {
							let len = menuList.push(item);
							let childrenArr = [];
							childrenArr = item.children.filter(child => {
								if (child.access !== undefined) {
									if (child.access === accessCode) {
										return child;
									}
								} else {
									return child;
								}
							});
							menuList[len - 1].children = childrenArr;
						}
					}
				} else {
					if (item.children.length === 1) {
						menuList.push(item);
					} else {
						let len = menuList.push(item);
						let childrenArr = [];
						childrenArr = item.children.filter(child => {
							if (child.access !== undefined) {
								if (Util.showThisRoute(child.access, accessCode)) {
									return child;
								}
							} else {
								return child;
							}
						});
						if (childrenArr === undefined || childrenArr.length === 0) {
							menuList.splice(len - 1, 1);
						} else {
							let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
							handledItem.children = childrenArr;
							menuList.splice(len - 1, 1, handledItem);
						}
					}
				}
			});
			state.menuList = menuList;
		},
		// 添加侧边导航栏打开菜单
		addOpenSubmenu(state, name) {
			state.openedSubmenuArr.length = 0;
			state.openedSubmenuArr.push(name);
		},
		// 关闭页面
		closePage(state, name) {
			state.cachePage.forEach((item, index) => {
				if (item === name) {
					state.cachePage.splice(index, 1);
				}
			});
		},
		// 设置缓存页
		initCachepage(state) {
			if (localStorage.cachePage) {
				state.cachePage = JSON.parse(localStorage.cachePage);
			}
		},
		// 关闭tag
		removeTag(state, name) {
			state.pageOpenedList.map((item, index) => {
				if (item.name === name) {
					state.pageOpenedList.splice(index, 1);
				}
			});
		},
		// 打开页列表
		pageOpenedList(state, get) {
			let openedPage = state.pageOpenedList[get.index];
			if (get.argu) {
				openedPage.argu = get.argu;
			}
			if (get.query) {
				openedPage.query = get.query;
			}
			state.pageOpenedList.splice(get.index, 1, openedPage);
			localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
		},
		// 清空tag
		clearAllTags(state) {
			state.pageOpenedList.splice(1);
			state.cachePage.length = 0;
			localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
		},
		// 关闭其他tag
		clearOtherTags(state, vm) {
			let currentName = vm.$route.name;
			let currentIndex = 0;
			state.pageOpenedList.forEach((item, index) => {
				if (item.name === currentName) {
					currentIndex = index;
				}
			});
			if (currentIndex === 0) {
				state.pageOpenedList.splice(1);
			} else {
				state.pageOpenedList.splice(currentIndex + 1);
				state.pageOpenedList.splice(1, currentIndex - 1);
			}
			let newCachepage = state.cachePage.filter(item => {
				return item === currentName;
			});
			state.cachePage = newCachepage;
			localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
		},
		// 设置打开页缓存
		setOpenedList(state) {
			state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
		},
		setCurrentPath(state, pathArr) {
			state.currentPath = pathArr;
		},
		setCurrentPageName(state, name) {
			state.currentPageName = name;
		},
		// 设置头像
		setAvator(state, path) {
			localStorage.avatorImgPath = path;
		},
		// 关闭所有侧边菜单栏
		clearOpenedSubmenu(state) {
			state.openedSubmenuArr.length = 0;
		},
		increateTag(state, tagObj) {
			if (!Util.oneOf(tagObj.name, state.dontCache)) {
				state.cachePage.push(tagObj.name);
				localStorage.cachePage = JSON.stringify(state.cachePage);
			}
			state.pageOpenedList.push(tagObj);
			localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
		}
	}
};

export default app;