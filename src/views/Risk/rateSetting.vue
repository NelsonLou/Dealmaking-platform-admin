<!-- 费率设置 -->
<template>
<div id="rateSetting" class="clearfloat">
	<Collapse class="Collapse" v-model="value1">
		<Panel name="">
			<span class="PanelTitle">止盈/止损/警戒比例</span>
			<p slot="content">止盈:<span>xxxxx</span></p>
			<p slot="content">止损:<span>xxxxx</span></p>
			<p slot="content">警戒:<span>xxxxx</span></p>
			<Button slot="content" type="primary" class="" @click='dialog = true'>修改</Button>
		</Panel>
		<Panel name="">
			<span class="PanelTitle">递延比例</span>
			<p slot="content">递延比例:<span>xxxxx</span></p>
			<Button slot="content" type="primary" class="" @click='dialog = true'>修改</Button>
		</Panel>
		<Panel name="">
			<span class="PanelTitle">T+1费用</span>
			<p slot="content">手续费:<span>xxxxx</span></p>
			<p slot="content">递延费:<span>xxxxx</span></p>
			<Button slot="content" type="primary" class="" @click='dialog = true'>修改</Button>
		</Panel>
		<Panel name="">
			<span class="PanelTitle">T+D费用</span>
			<p slot="content">手续费:<span>xxxxx</span></p>
			<p slot="content">递延费:<span>xxxxx</span></p>
			<Button slot="content" type="primary" class="" @click='dialog = true'>修改</Button>
		</Panel>
		<Panel name="">
			<span class="PanelTitle">盈利分成</span>
			<p slot="content">投资人:<span>xxxxx</span></p>
			<p slot="content">策略人:<span>xxxxx</span></p>
			<Button slot="content" type="primary" class="" @click='dialog = true'>修改</Button>
		</Panel>
	</Collapse>
	<!-- 弹窗 -->
	<Modal v-model="dialog" title="title" @on-ok="submit()" @on-cancel="dialog = false">
		<Form ref="setForm" :model="form" :rules="ruleValidate" :label-width="60">
			<FormItem label="valueA" prop="valueA">
				<Input v-model="form.valueA"></Input>
			</FormItem>
			<FormItem label="valueB" prop="valueB">
				<Input v-model="form.valueB"></Input>
			</FormItem>
			<FormItem label="valueC" prop="valueC">
				<Input v-model="form.valueC"></Input>
			</FormItem>
		</Form>
	</Modal>
</div>
</template>
<script>
export default {
	name: "rateSetting",
	data() {
		return {
			dialog: false, // 弹窗控制
			value1: '',
			title: '',
			ruleValidate: {},
			form: {
				valueA: '',
				valueB: '',
				valueC: ''
			}
		}
	},
	activated() {},
	methods: {
		submit() {
			console.log('submit!')
		}
	}
}
</script>
<style scoped>
.Collapse {
	margin-top: 20px;
}

.Collapse p {
	margin-bottom: 15px;
	font-size: 15px;
}

.Collapse span {
	margin-left: 10px;
}

.PanelBtn {
	margin-left: 45%;
	margin-bottom: 20px;
}

.PanelTitle {
	font-weight: 700;
	font-size: 16px;
}
</style>
