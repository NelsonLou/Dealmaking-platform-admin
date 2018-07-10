<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
.top_num {
    font-size: 24px;
    font-weight: 700;
    text-align: right;
}
</style>
<template>
<div class="home-main">
	<Row :gutter="10">
		<Col :md="24" :lg="8">
		<!-- 用户 -->
		<Row class-name="home-page-row1" :gutter="10">
			<Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
			<Card>
				<Row type="flex" class="user-infor">
					<Col span="8">
					<Row class-name="made-child-con-middle" type="flex" align="middle">
						<img class="avator-img" :src="avatorPath" />
					</Row>
					</Col>
					<Col span="16" style="padding-left:6px;">
					<Row class-name="made-child-con-middle" type="flex" align="middle">
						<div>
							<b class="card-user-infor-name">{{userName}}</b>
						</div>
					</Row>
					</Col>
				</Row>
			</Card>
			</Col>
		</Row>
		</Col>
		<Col :md="24" :lg="16">
		<!-- 今日注册... -->
		<Row :gutter="5">
			<Col v-for='item in userData' :key='item.label' :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
			<Card>
				<div class="top_num" :style="{
					color:item.color,
					}">{{item.num}}</div>
				<div style="text-align:right">{{item.name}}</div>
			</Card>
			</Col>
		</Row>
		</Col>
	</Row>
	<!-- 今日充值/今日提现 -->
	<Row class="margin-top-10">
		<Col :xs="24" :sm="12" :md="10" :style="{marginBottom: '10px'}">
		<Card>
			<div class="" style="font-size:20px;font-weight: 700;">
				{{moneyData[0].title}}
			</div>
			<div class="top_num" :style="{
				color:moneyData[0].color,
				}">{{moneyData[0].num}}</div>
			<div style="text-align:right">{{moneyData[0].label}}</div>
		</Card>
		</Col>
		<Col :xs="24" :sm="12" :md="10" :style="{marginBottom: '10px',marginLeft:'20px'}">
		<Card>
			<div class="" style="font-size:20px;font-weight: 700;">
				{{moneyData[1].title}}
			</div>
			<div class="top_num" :style="{
				color:moneyData[1].color,
				}">{{moneyData[1].num}}</div>
			<div style="text-align:right">{{moneyData[1].label}}</div>
		</Card>
		</Col>
	</Row>
	<!-- 策略余额/钱包余额 -->
	<Row class="margin-top-10">
		<Col :xs="24" :sm="12" :md="10" :style="{marginBottom: '10px'}">
		<Card>
			<div class="" style="font-size:20px;font-weight: 700;">
				{{moneyData[2].title}}
			</div>
			<div class="top_num" :style="{
				color:moneyData[2].color,
				}">{{moneyData[2].num}}</div>
			<div style="text-align:right">{{moneyData[2].label}}</div>
		</Card>
		</Col>
		<Col :xs="24" :sm="12" :md="10" :style="{marginBottom: '10px',marginLeft:'20px'}">
		<Card>
			<div class="" style="font-size:20px;font-weight: 700;">
				{{moneyData[3].title}}
			</div>
			<div class="top_num" :style="{
				color:moneyData[3].color,
				}">{{moneyData[3].num}}</div>
			<div style="text-align:right">{{moneyData[3].label}}</div>
		</Card>
		</Col>
	</Row>
	<!-- 当前持仓统计 -->
	<Row :gutter="10" class="margin-top-10">
		<Col :md="24" :lg="24" :style="{marginBottom: '10px'}">
		<Card>
			<p slot="title" class="card-title">
				当前持仓统计
			</p>
			<div class="data-source-row clearfloat">
				<statistics v-for='item in tradeNowData' :key='item.name' :name='item.name' :num='item.num'></statistics>
			</div>
		</Card>
		</Col>
	</Row>
	<!-- 最近平仓明细 -->
	<Row class="margin-top-10">
		<Card>
			<p slot="title" class="card-title">
				最近平仓明细
			</p>
			<div class="data-source-row">
				<Table border :columns="columns" :data="recordsLastData"></Table>
			</div>
		</Card>
	</Row>
</div>
</template>

<script>
import statistics from './components/statistics.vue';

export default {
	name: 'home',
	components: {
		statistics,
	},
	data() {
		return {
			userData: [{
					name: '今日注册人数',
					value: 'zc_count',
					num: '',
					color: '#ff7676'
				},
				{
					name: '今日充值人数',
					value: 'cz_count',
					num: '',
					color: '#2cabe3'
				},
				{
					name: '今日提现人数',
					value: 'tx_count',
					num: '',
					color: '#53e69d'
				},
				{
					name: '今日买入人数',
					value: 'mr_count',
					num: '',
					color: '#ffc36d'
				}
			],
			recordsLastData: [],
			moneyData: [{
					title: '今日充值',
					label: '今日累计充值总金额',
					value: 'cz_money',
					num: '',
					color: '#ff7676'
				},
				{
					title: '今日提现',
					label: '今日累计提现总金额',
					value: 'tx_money',
					num: '',
					color: '#2cabe3'
				},
				{
					title: '策略余额',
					label: '用户剩余策略余额总额',
					value: 'cl_money',
					num: '',
					color: '#53e69d'
				},
				{
					title: '钱包余额',
					label: '用户钱包余额总额',
					value: 'qb_money',
					num: '',
					color: '#ffc36d'
				}
			],
			showAddNewTodo: false,
			newToDoItemValue: '',
			tradeNowData: [{ // 当前持仓统计
					name: '信用金总额',
					value: 'xyj_money',
					num: '0'
				},
				{
					name: '占用操盘金额总额',
					value: 'zyzj_money',
					num: '87,529,595.76'
				},
				{
					name: '递延费总额',
					value: 'dyf_money',
					num: '967,068.54'
				},
				{
					name: '单位递延费总额',
					value: 'dwdyf_money',
					num: '213,591.82'
				},
				{
					name: '买入佣金总额',
					value: 'mryj_money',
					num: '131,018.37'
				},
				{
					name: '买入过户费总额',
					value: 'xyj_money',
					num: '2,030.40'
				}
			],
			columns: [{
					title: '日期',
					key: 'data_date'
				},
				{
					title: '总信用金',
					key: 'total_amount'
				},
				{
					title: '总盈亏',
					key: 'total_profit'
				},
				{
					title: '策略人盈利总额',
					key: 'individual_profit_plus'
				},
				{
					title: '策略人亏损总额',
					key: 'individual_profit_minus'
				},
				{
					title: '策略人盈亏总额',
					key: 'total_individual_profit'
				},
				{
					title: '投资人盈利分成总额',
					key: 'total_investor_profit'
				},
				{
					title: '综合费总额',
					key: 'total_comprehensive_fee'
				},
				{
					title: '递延费总额',
					key: 'total_hold_fee'
				},
				{
					title: '穿仓总金额',
					key: 'total_below_amount'
				}
			]
		};
	},
	mounted() {
		this.getData()
	},
	computed: {
		avatorPath() {
			return localStorage.avatorImgPath;
		},
		userName() {
			return '后台管理员'
		}
	},
	methods: {
		// 获取数据
		getData() {
			let api = this.$api.common.index
			this.$axios.get(api).then(res => {
				for (let i in this.tradeNowData) {
					this.tradeNowData[i].num = res.data.tradeNowData[this.tradeNowData[i].value]
				}
				for (let i in this.userData) {
					this.userData[i].num = res.data.userData[this.userData[i].value]
				}
				for (let i in this.moneyData) {
					this.moneyData[i].num = res.data.moneyData[this.moneyData[i].value]
				}
				this.recordsLastData = res.data.recordsLastData
			}).catch(err => {
				console.log(err);
			})
		},
	}
}
</script>
