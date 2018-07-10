import Main from '@/views/Main.vue';

// ***策略管理Strategy/***
// 委托策略
const SystemEntrust = () =>
	import ('@/views/Strategy/systemEntrust')
// 成交策略
const Deal = () =>
	import ('@/views/Strategy/deal')
// 今日结算
const SettleHistory = () =>
	import ('@/views/Strategy/settleHistory')
// 历史结算
const SettleToday = () =>
	import ('@/views/Strategy/settleToday')
// 停牌策略
const Suspension = () =>
	import ('@/views/Strategy/suspension')
// 非自动递延策略
const UnAutoDeferred = () =>
	import ('@/views/Strategy/unAutoDeferred')
// 自动递延策略
const AutoDeferred = () =>
	import ('@/views/Strategy/autoDeferred')
// 追踪策略
const Track = () =>
	import ('@/views/Strategy/track')
// 递延失败策略
const DeferredFailure = () =>
	import ('@/views/Strategy/deferredFailure')

// ***资金管理Capital/***
// 结算记录
const SettledRecord = () =>
	import ('@/views/Capital/settledRecord')
// 提现列表
const ToCash = () =>
	import ('@/views/Capital/toCash')
// 充值列表
const Recharge = () =>
	import ('@/views/Capital/recharge')
// 代理商提现处理
const AgentsToCash = () =>
	import ('@/views/Capital/agentsToCash')

// ***风控管理Risk/***
// 资金列表
const CapitalAccount = () =>
	import ('@/views/Risk/capitalAccount')
// 除权除息列表
const ExDividend = () =>
	import ('@/views/Risk/exDividend')
// 当日股权登记策略
const NowRegistration = () =>
	import ('@/views/Risk/nowRegistration')
// 历史股权登记策略
const BeforeRegistration = () =>
	import ('@/views/Risk/beforeRegistration')
// 今日停牌
const TodayResumption = () =>
	import ('@/views/Risk/todayResumption')
// 今日复牌
const TodaySuspension = () =>
	import ('@/views/Risk/todaySuspension')
// 费率设置
// const RateSetting = () =>
// 	import ('@/views/Risk/rateSetting')
// 个股管理
const SharesManage = () =>
	import ('@/views/Risk/sharesManage')
// 交易日管理
const TradingDay = () =>
	import ('@/views/Risk/tradingDay')
// 交易时间管理
const TradingTime = () =>
	import ('@/views/Risk/tradingTime')
// 交易比例列表
const TransactionProp = () =>
	import ('@/views/Risk/transactionProp')

// ***系统管理system/***
// 角色管理
const Role = () =>
	import ('@/views/System/role')
// 用户管理
const User = () =>
	import ('@/views/System/user')
// 系统配置
const Setting = () =>
	import ('@/views/System/setting')
// 版本管理
const Version = () =>
	import ('@/views/System/version')

// ***内容管理Content/***
// 系统消息管理
const SystemMessage = () =>
	import ('@/views/Content/systemMessage')
// 公告管理
const NoticeManage = () =>
	import ('@/views/Content/noticeManage')
// 首页轮播设置
const Carousel = () =>
	import ('@/views/Content/carousel')
// 播报信息管理
const Broadcast = () =>
	import ('@/views/Content/broadcast')

// ***日志管理record/***
// 操作日志
const Operation = () =>
	import ('@/views/Record/operation')
// 错误日志
const Errors = () =>
	import ('@/views/Record/errors')
// 登录日志
const LoginRecord = () =>
	import ('@/views/Record/loginRecord')

// ***用户管理userManage/***
// 用户列表
const UserList = () =>
	import ('@/views/UserManage/userList')
// 验证码
const Verification = () =>
	import ('@/views/UserManage/verification')

// ***代理商管理agentsManage***
// 代理商列表
const AgentsList = () =>
	import ('@/views/AgentsManage/agentsList')

// ***异常处理ErrorDeal***
//	重复结算处理
const ManualOrder = () =>
	import ('@/views/ErrorDeal/manualOrder')
// 自动递延手动执行
const HandleDealAuto = () =>
	import ('@/views/ErrorDeal/handleDealAuto')
// 冻结保证金处理
const FrozenBond = () =>
	import ('@/views/ErrorDeal/frozenBond')

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
	path: '/login',
	name: 'login',
	meta: {
		title: 'Login - 登录'
	},
	component: () =>
		import ('@/views/login.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
	path: '/',
	name: 'otherRouter',
	redirect: '/home',
	component: Main,
	children: [{
			path: 'home',
			title: {
				i18n: 'home'
			},
			name: 'home_index',
			component: () =>
				import ('@/views/home/home.vue')
		},
		{
			path: 'ownspace',
			title: '个人中心',
			name: 'ownspace_index',
			component: () =>
				import ('@/views/own-space/own-space.vue')
		},
	]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [{
		path: '/strategy',
		icon: 'cube',
		name: 'strategy',
		title: '策略管理',
		component: Main,
		children: [{
				path: 'systemEntrust',
				icon: '',
				name: 'systemEntrust',
				title: '委托策略',
				component: SystemEntrust
			},
			{
				path: 'deal',
				icon: '',
				name: 'deal',
				title: '成交策略',
				component: Deal
			},
			{
				path: 'settleToday',
				icon: '',
				name: 'settleToday',
				title: '今日结算策略',
				component: SettleToday
			},
			{
				path: 'settleHistory',
				icon: '',
				name: 'settleHistory',
				title: '历史结算策略',
				component: SettleHistory
			},
			{
				path: 'suspension',
				icon: '',
				name: 'suspension',
				title: '停牌策略',
				component: Suspension
			},
			{
				path: 'unAutoDeferred',
				icon: '',
				name: 'unAutoDeferred',
				title: '非自动递延策略',
				component: UnAutoDeferred
			},
			{
				path: 'autoDeferred',
				icon: '',
				name: 'autoDeferred',
				title: '自动递延策略',
				component: AutoDeferred
			},
			{
				path: 'deferredFailure',
				icon: '',
				name: 'deferredFailure',
				title: '递延失败策略',
				component: DeferredFailure
			},
			{
				path: 'track',
				icon: '',
				name: 'track',
				title: '追踪策略',
				component: Track
			},
		]
	},
	{
		path: '/fundsManage',
		icon: 'ios-list-outline',
		name: 'fundsManage',
		title: '资金管理',
		component: Main,
		children: [
			// {
			// 	path: 'settledRecord',
			// 	icon: '',
			// 	name: 'settledRecord',
			// 	title: '结算记录',
			// 	component: SettledRecord
			// },
			{
				path: 'recharge',
				icon: '',
				name: 'recharge',
				title: '充值列表',
				component: Recharge
			},
			{
				path: 'toCash',
				icon: '',
				name: 'toCash',
				title: '提现列表',
				component: ToCash
			},
			// {
			// 	path: 'agentsToCash',
			// 	icon: '',
			// 	name: 'agentsToCash',
			// 	title: '代理商提现处理',
			// 	component: AgentsToCash
			// },
		]
	},
	{
		path: '/risk',
		icon: 'android-warning',
		name: 'risk',
		title: '风控管理',
		component: Main,
		children: [{
				path: 'exDividend',
				icon: '',
				name: 'exDividend',
				title: '除权除息列表',
				component: ExDividend
			},
			{
				path: 'nowRegistration',
				icon: '',
				name: 'nowRegistration',
				title: '当日股权登记策略',
				component: NowRegistration
			},
			{
				path: 'beforeRegistration',
				icon: '',
				name: 'beforeRegistration',
				title: '历史股权登记策略',
				component: BeforeRegistration
			},
			{
				path: 'sharesManage',
				icon: '',
				name: 'sharesManage',
				title: '个股管理',
				component: SharesManage
			},
			{
				path: 'todaySuspension',
				icon: '',
				name: 'todaySuspension',
				title: '今日停牌',
				component: TodaySuspension
			},
			{
				path: 'todayResumption',
				icon: '',
				name: 'todayResumption',
				title: '今日复牌',
				component: TodayResumption
			},
			{
				path: 'capitalAccount',
				icon: '',
				name: 'capitalAccount',
				title: '资金账户管理',
				component: CapitalAccount
			},
			{
				path: 'transactionProp',
				icon: '',
				name: 'transactionProp',
				title: '交易比例',
				component: TransactionProp
			},
			{
				path: 'tradingDay',
				icon: '',
				name: 'tradingDay',
				title: '交易日管理',
				component: TradingDay
			},
			{
				path: 'tradingTime',
				icon: '',
				name: 'tradingTime',
				title: '交易时间',
				component: TradingTime
			},
			// {
			// 	path: 'rateSetting',
			// 	icon: '',
			// 	name: 'rateSetting',
			// 	title: '费率设置',
			// 	component: RateSetting
			// },
		]
	},
	{
		path: '/system',
		icon: 'social-buffer',
		name: 'system',
		title: '系统管理',
		component: Main,
		children: [{
				path: 'version',
				icon: '',
				name: 'version',
				title: '客户端版本设置',
				component: Version
			},
			// {
			// 	path: 'role',
			// 	icon: '',
			// 	name: 'role',
			// 	title: '角色管理',
			// 	component: Role
			// },
			// {
			// 	path: 'user',
			// 	icon: '',
			// 	name: 'user',
			// 	title: '用户管理',
			// 	component: User
			// },
			// {
			// 	path: 'setting',
			// 	icon: '',
			// 	name: 'setting',
			// 	title: '系统配置',
			// 	component: Setting
			// },
		]
	},
	{
		path: '/contentManage',
		icon: 'ios-pie',
		name: 'contentManage',
		title: '内容管理',
		component: Main,
		children: [{
				path: 'systemMessage',
				icon: '',
				name: 'systemMessage',
				title: '消息管理',
				component: SystemMessage
			},
			{
				path: 'noticeManage',
				icon: '',
				name: 'noticeManage',
				title: '公告管理',
				component: NoticeManage
			},
			{
				path: 'carousel',
				icon: '',
				name: 'carousel',
				title: '首页轮播设置',
				component: Carousel
			},
			{
				path: 'broadcast',
				icon: '',
				name: 'broadcast',
				title: '播报信息管理',
				component: Broadcast
			},
		]
	},
	// {
	// 	path: '/recordManage',
	// 	icon: 'ios-compose',
	// 	name: 'recordManage',
	// 	title: '日志管理',
	// 	component: Main,
	// 	children: [{
	// 			path: 'operation',
	// 			icon: '',
	// 			name: 'operation',
	// 			title: '操作日志',
	// 			component: Operation
	// 		},
	// {
	// 	path: 'errors',
	// 	icon: '',
	// 	name: 'errors',
	// 	title: '错误日志',
	// 	component: Errors
	// },
	// {
	// 	path: 'loginRecord',
	// 	icon: '',
	// 	name: 'loginRecord',
	// 	title: '登录日志',
	// 	component: LoginRecord
	// },
	// 	]
	// },
	{
		path: '/userManage',
		icon: 'person-stalker',
		name: 'userManage',
		title: '用户管理',
		component: Main,
		children: [{
				path: 'userList',
				icon: '',
				name: 'userList',
				title: '用户列表',
				component: UserList
			},
			{
				path: 'verification',
				icon: '',
				name: 'verification',
				title: '验证码',
				component: Verification
			},
		]
	},
	{
		path: '/agentsManage',
		icon: 'social-buffer',
		name: 'agentsManage',
		title: '代理商管理',
		component: Main,
		children: [{
			path: 'agentsList',
			icon: '',
			name: 'agentsList',
			title: '代理商列表',
			component: AgentsList
		}, ]
	},
	{
		path: '/errorManage',
		icon: 'bug',
		name: 'errorManage',
		title: '异常处理',
		component: Main,
		children: [{
				path: 'frozenBond',
				icon: '',
				name: 'frozenBond',
				title: '冻结保证金处理',
				component: FrozenBond
			},
			{
				path: 'manualOrder',
				icon: '',
				name: 'manualOrder',
				title: '重复结算处理',
				component: ManualOrder
			},
			{
				path: 'handleDealAuto',
				icon: '',
				name: 'handleDealAuto',
				title: '自动递延手动执行',
				component: HandleDealAuto
			},
		]
	},
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
	loginRouter,
	otherRouter,
	...appRouter,
];