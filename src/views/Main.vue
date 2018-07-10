<style lang="less">
@import "./main.less";
.mark {
    text-align: center;
    position: absolute;
    bottom: 20px;
    left: 48%;
}
</style>
<template>
<div class="main" :class="{'main-hide-text': shrink}">
	<!-- 导航栏 -->
	<div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
		<shrinkable-menu :shrink="shrink" @on-change="handleSubmenuChange" :before-push="beforePush" :open-names="openedSubmenuArr" :menu-list="menuList">
			<div slot="top" class="logo-con">
				<img v-show="!shrink" src="../images/logo.jpg" key="max-logo" />
				<!-- <img v-show="shrink" src="../images/logo-min.jpg" key="min-logo" /> -->
			</div>
		</shrinkable-menu>
	</div>
	<!-- 头部操作栏 -->
	<div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
		<div class="main-header">
			<div class="navicon-con">
				<Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                    <Icon type="navicon" size="32"></Icon>
             	</Button>
			</div>
			<div class="header-middle-con">
				<div class="main-breadcrumb">
					<breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
				</div>
			</div>
			<div class="header-avator-con">
				<div class="user-dropdown-menu-con">
					<Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
						<Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
							<a href="javascript:void(0)">
                                <span class="main-user-name">{{ userName }}</span>
                                <Icon type="arrow-down-b"></Icon>
                            </a>
							<DropdownMenu slot="list">
								<DropdownItem name="ownSpace">个人中心</DropdownItem>
								<DropdownItem name="loginout" divided>退出登录</DropdownItem>
							</DropdownMenu>
						</Dropdown>
						<Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
					</Row>
				</div>
			</div>
		</div>
		<div class="tags-con">
			<tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
		</div>
	</div>
	<!-- 主页面 -->
	<div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
		<div class="single-page">
			<keep-alive :include="cachePage">
				<router-view></router-view>
			</keep-alive>
		</div>
	</div>
</div>
</template>
<script>
import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
import tagsPageOpened from './main-components/tags-page-opened.vue';
import breadcrumbNav from './main-components/breadcrumb-nav.vue';
import Cookies from 'js-cookie';
import util from '@/libs/util.js';

export default {
	components: {
		shrinkableMenu,
		tagsPageOpened,
		breadcrumbNav,
	},
	data() {
		return {
			// 菜单栏缩进
			shrink: false,
			// 用户名
			userName: '后台管理员',
			// 是否全屏
			isFullScreen: false,
			// 默认打开的导航栏
			openedSubmenuArr: this.$store.state.app.openedSubmenuArr
		};
	},
	mounted() {
		this.init();
	},
	created() {
		// 显示打开的页面的列表
		this.$store.commit('setOpenedList');
	},
	methods: {
		// 初始化
		init() {
			let pathArr = util.setCurrentPath(this, this.$route.name);
			this.$store.commit('updateMenulist');
			this.checkTag(this.$route.name);
		},
		// 菜单栏缩进
		toggleClick() {
			this.shrink = !this.shrink;
		},
		// 用户下拉菜单
		handleClickUserDropdown(name) {
			if (name === 'ownSpace') {
				util.openNewPage(this, 'ownspace_index');
				this.$router.push({
					name: 'ownspace_index'
				});
			} else if (name === 'loginout') {
				// 退出登录
				this.$store.dispatch("logoutRequest");
				this.$store.commit('clearOpenedSubmenu');
				this.$router.push({
					name: 'login'
				});
			}
		},
		// 检测顶部导航栏
		checkTag(name) {
			let openpageHasTag = this.pageTagsList.some(item => {
				if (item.name === name) {
					return true;
				}
			});
			if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
				util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
			}
		},
		// 修改侧边展开栏目
		handleSubmenuChange(val) {
			var route = this.$router.options.routes
			for (let i = 0; i < route.length; i++) {
				if (route[i].children != undefined) {
					for (let j = 0; j < route[i].children.length; j++) {
						if (route[i].children[j].name == val) {
							this.$store.commit('addOpenSubmenu', route[i].name);
						}
					}
				} else {
					if (route[i].name == val) {
						this.$store.commit('addOpenSubmenu', route[i].name);
					}
				}
			}
		},
		// 路由跳转前
		beforePush(name) {
			return true;
		},
	},
	watch: {
		'$route' (to) {
			this.$store.commit('setCurrentPageName', to.name);
			let pathArr = util.setCurrentPath(this, to.name);
			this.checkTag(to.name);
			localStorage.currentPageName = to.name;
		},
	},
	computed: {
		// 菜单列表
		menuList() {
			return this.$store.state.app.menuList;
		},
		// 打开的页面的页面对象
		pageTagsList() {
			return this.$store.state.app.pageOpenedList;
		},
		// 面包屑
		currentPath() {
			return this.$store.state.app.currentPath; // 当前面包屑数组
		},
		// 头像
		avatorPath() {
			return localStorage.avatorImgPath;
		},
		// 缓存的页面
		cachePage() {
			return this.$store.state.app.cachePage;
		},
	}
};
</script>
