// 根据环境修改api 地址
const domain = (process.env.NODE_ENV == 'production') ? 'https://api.eastpolicy.com' : (process.env.NODE_ENV == 'development') ? 'https://api-eastpolicy.maiguokj.com' : 'https://api-eastpolicy.maiguokj.com'

// 接口配置
export const config = {
	url: `${domain}`,
	// 接口地址
	limit: 10 // 每页显示条目个数
}

// 基础接口映射
export const common = {
	// 首页数据接口
	index: '/admin/index',
	// 获取时间接口
	server_time: '/admin/server/time',
	// 搜索代理商接口
	select_agent: '/admin/select-agent',
	// 根据股票代码查找股票id
	select_stock: '/admin/select-stock',
	// 搜索用户接口
	select_user: '/admin/select-user',
	// OSS上传参数
	oss_key_post: '/admin/oss-key-post',
	// 查询风险等级
	select_risk_level: '/admin/select-risk-level',
	// 获取所有资金账户
	investors: '/admin/investors',
	// 成交策略导出
	export_policies_deal: '/admin/export/policies/deal',
	// 充值列表导出
	export_order_list: '/admin/export/order-list',
	// 用户提现列表导出
	export_user_withdraw_records: 'admin/export/user-withdraw-records',
	// 今日结算策略导出
	export_policies_settlement_today: 'admin/export/policies/settlement/today',
	// 历史结算策略导出
	export_policies_settlement_history: 'admin/export/policies/settlement/history',
	// 登录验证码
	code: '/code/',
}
// 代理商
export const agents = {
	// 代理商列表
	agentsList: '/admin/agents',
	// 添加代理商
	addAgents: '/admin/agents-add',
	// 重置密码
	agents_password: '/admin/agent-password',
	// 删除代理商
	agent_destroy: '/admin/agent-destroy',
	// 获取代理商信息（修改用）
	agents_account: '/admin/agents-account',
	// 修改代理商信息
	agents_edit: '/admin/agents-edit',
	// 查看详细
	agent: '/admin/agent',
	// 获取递延费比例接口
	deferred_ratio: '/admin/deferred-ratio',
}
// 用户管理
export const userManage = {
	// 用户列表
	users: '/admin/users',
	// 单个用户信息
	user: '/admin/user',
	// 验证码
	users_code: '/admin/users-code',
	// 策略流水
	users_policy_flow: '/admin/users-policy-flow',
	// 钱包流水
	users_cash_flow: '/admin/users-cash-flow',
	// 修改用户信息
	users_edit: '/admin/users-edit',
	// 实名认证
	users_certification: '/admin/users-certification',
	// 软删除用户
	users_destroy: '/admin/users-destroy',
}
// 内容管理
export const content = {
	// 公告列表
	notices: '/admin/notices',
	// 单条公告
	notice: '/admin/notice',
	// 编辑公告
	notices_edit: '/admin/notices-edit',
	// 添加公告
	notices_create: '/admin/notices-create',
	// 禁用公告
	media_disable: '/admin/media-disable',
	// 恢复公告/banner
	media_enable: '/admin/media-enable',
	// 删除公告/轮播
	media_destroy: '/admin/media-destroy',
	// 消息管理
	messages: '/admin/messages',
	// 播报信息管理
	broadcasts: '/admin/broadcasts',
	// 单条播报信息
	broadcast: '/admin/broadcast',
	// 删除播报信息
	broadcasts_destroy: '/admin/broadcasts-destroy',
	// 添加轮播
	banners_create: '/admin/banners-create',
	// 修改轮播
	banners_edit: '/admin/banners-edit',
	// 获取单条轮播
	banner: '/admin/banner',
	// 轮播列表
	banners: '/admin/banners',
}
// 资金管理
export const capital = {
	// 结算列表
	agent_statement_records: '/admin/agent-statement-records',
	// 代理商提现处理
	agent_withdraw_records: '/admin/agent-withdraw-records',
	// 代理商提现处理-申请提现
	agent_withdraw_record: '/admin/agent-withdraw-record',
	// 获取提现状态
	withdraw_status: '/admin/withdraw-status',
	// 提现记录
	user_withdraw_records: '/admin/user-withdraw-records',
	// 单条申请提现
	user_withdraw_record: '/admin/user-withdraw-record',
	// 去提现
	user_withdraw_pass: '/admin/user-withdraw-pass',
	// 充值状态
	order_status: '/admin/order-status',
	// 汇款失败
	user_withdraw_unpass: '/admin/user-withdraw-unpass',
	// 获取充值列表
	order_list: '/admin/order-list',
	// 作废/删除充值记录
	order_alipay_destroy: '/admin/order-alipay-destroy',
	// 支付宝转账确认-获取信息接口
	order_alipay: '/admin/order-alipay',
	// 支付宝转账确认-确认
	order_alipay_success: '/admin/order-alipay-success',
	// 结算记录列表
	agent_statement_records: '/admin/agent-statement-records',
}
// 策略管理
export const strategy = {
	// 自动递延策略列表
	policies_auto_hold: '/admin/policies/auto-hold',
	// 递延失败策略列表
	policies_auto_hold_failed: '/admin/policies/auto-hold-failed',
	// 追踪策略
	policies_trace: '/admin/policies/trace',
	// 非自动递延策略列表
	policies_auto_hold_not: '/admin/policies/auto-hold-not',
	// 成交策略
	policies_deal: '/admin/policies/deal',
	// 委托策略
	policies_entrust: '/admin/policies/entrust',
	// 单条委托策略（资金账户修改）
	policy_entrust_investor: '/admin/policy/entrust/investor',
	// 资金账户修改
	policy_investor_edit: '/admin/policy/investor-edit',
	// 委托撤销
	policy_entrust_revoke: '/admin/policy/entrust-revoke',
	// 获取平仓类型
	policy_trade_sell_type: '/admin/policy/trade-sell-type',
	// 今日结算策略
	policies_settlement_today: '/admin/policies/settlement/today',
	// 今日结算策略详细
	policy_settlement_today: '/admin/policy/settlement/today',
	// 历史结算策略
	policies_settlement_history: '/admin/policies/settlement/history',
	// 历史结算策略详细
	policy_settlement_history: '/admin/policy/settlement/history',
	// 停牌策略
	policies_stop: '/admin/policies/stop',
	// 单条停牌策略 get
	policy_stop: '/admin/policy/stop',
	// 买断 post
	policy_stop_post: '/admin/policy/stop',
	// 手动处理买入
	policies_entrust_manual_buy: '/admin/policies/entrust/manual/buy',
	// 手动处理卖出
	policies_entrust_manual_sell: '/admin/policies/entrust/manual/sell',
	// 递延失败发送信息
	policies_auto_hold_failed_push: '/admin/policies/auto-hold-failed/push',
}
// 系统设置
export const system = {
	// 获取客户端版本设置
	versions: '/admin/versions',
	// 获取单条客户端版本设置
	version: '/admin/version',
	// 修改版本
	version_update: '/admin/version-update',
}
// 风控管理
export const risk = {
	// 除权除息列表
	xrtxds: '/admin/xrtxds',
	// 添加除权除息方案
	xrtxds_create: '/admin/xrtxds-create',
	// 获取单条除权除息方案
	xrtxd: '/admin/xrtxd',
	// 修改除权除息方案
	xrtxds_edit: '/admin/xrtxds-edit',
	// 当日股票登记策略
	rsp_today: '/admin/rsp-today',
	// 历史股权登记
	rsp_all: '/admin/rsp-all',
	// 除权除息比对
	rsp_xrtxd: '/admin/rsp-xrtxd',
	// 交易时间管理 get方式
	transaction_hour: '/admin/transaction-hour',
	// 修改交易时间 post方法
	transaction_hour: '/admin/transaction-hour',
	// 获取非交易日
	trading_day: '/admin/trading-day',
	// 删除非交易日
	trading_day_destroy: '/admin/trading-day-destroy',
	// 添加非交易日
	trading_day_create: '/admin/trading-day-create',
	// 获取交易比例
	ratios: '/admin/ratios',
	// 获取单条交易比例
	ratio: '/admin/ratio',
	// 添加交易比例
	ratio_create: '/admin/ratio-create',
	// 修改交易比例
	ratio_edit: '/admin/ratio-edit',
	// 获取所有资金账号
	investors: '/admin/investors',
	// 获取单条资金账号
	investor: '/admin/investor',
	// 资金账户上移
	investor_up: '/admin/investor-up',
	// 创建资金账号
	investor_create: '/admin/investor-create',
	// 修改资金账号
	investor_edit: '/admin/investor-edit',
	// 个股管理
	stocks: '/admin/stocks',
	// 获取单条股票信息
	stock: '/admin/stock',
	// 删除单条个股
	stocks_destroy: '/admin/stocks-destroy',
	// 添加个股
	stocks_create: '/admin/stocks-create',
	// 修改单条股票
	stocks_edit: '/admin/stocks-edit',
	// 今日停牌列表
	stop_stocks: '/admin/stop-stocks',
	// 设置今日停牌
	stop_stocks_edit: '/admin/stop-stocks-edit',
	// 设置复牌
	start_stocks_edit: '/admin/start-stocks-edit',
	// 复牌列表
	start_stocks: '/admin/start-stocks'
}
// 异常处理
export const errorDeal = {
	// 冻结保证金列表
	multi_frozen_money_list: '/admin/multi-frozen-money/list',
	// 修正冻结保证金
	multi_frozen_money_manager: '/admin/multi-frozen-money/manager',
	// 重复结算列表
	repeat_settlement_list: '/admin/repeat-settlement/list',
	// 重复结算处理
	repeat_settlement_manager: '/admin/repeat-settlement/manager',
	// 自动递延手动执行
	auto_deferred_manual: '/admin/auto-deferred-manual'
}
// 用户接口
export const user = {
	// 管理员登录
	login: '/admin/login',
	// 管理员登出
	logout: '/admin/logout',
	// 修改登录密码
	password_login: '/admin/password/login'
}
