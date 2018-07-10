# 交易撮合平台

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

<!-- 代理商后台基础版本 -->
├── build  项目构建配置
├── dist 编译后生产环境项目    <!-- 编译后 -->
└── src
    ├── axios   接口配置
    ├── images  图片存储
    ├── libs    工具方法
           ├── util    常用方法
           ├── jwt     token存储/读取方法
    ├── mock    模拟数据
    ├── router  路由配置
    ├── store   状态管理
    ├── styles  样式文件
    └── views   页面部分
        ├── AgentsManage    代理商管理
            |—— agentList       代理商列表
        ├── captial         资金管理
            |—— agentsToCash    代理商提现
            |—— recharge        充值列表   
            |—— settledRecord   结算记录    
            |—— toCash          提现列表
        ├── components      页面组件
            |—— editor          富文本编辑器组件
        ├── content         内容管理
            |—— broadcast       播报信息管理         
            |—— carousel        首页轮播管理          
            |—— noticeManage    公告管理          
            |—— systemMessage   消息管理
        ├── errorDeal       异常处理
            |—— frozenBond      冻结保证金         
            |—— handleDealAuto  自动递延手动执行          
            |—— manualOrder     重复结算处理
        ├── home            首页
        │   ├── components      首页组件
        │   ├── components      首页组件
        ├── own-space       个人主页
        ├── record          日志管理
        ├── Risk            风控管理
            |—— exDividend          除权除息列表
            |—— nowRegistration     当日股权登记策略
            |—— beforeRegistration  历史股权登记策略
            |—— sharesManage        个股管理
            |—— todaySuspension     今日停牌
            |—— todayResumption     今日复牌
            |—— capitalAccount      资金账户管理
            |—— transactionProp     交易比例
            |—— tradingDay          交易日管理
            |—— tradingTime         交易时间管理
        ├── strategy        策略管理
            |—— systemEntrust   委托策略
            |—— deal            成交策略
            |—— settlement      结算策略
            |—— suspension      停牌策略
            |—— unAutoDeferred  非自动递延策略
            |—— autoDeferred    自动递延策略
            |—— deferredFailure 递延失败策略
            |—— track           追踪策略
    ├── app     主组件
    ├── common  代码模板   
    ├── main     主函数   
