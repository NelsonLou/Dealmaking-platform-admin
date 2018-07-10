<template>
<div id="" class="left box">
	<p class="num">￥{{num}}</p>
	<p class="name">{{name}}</p>
</div>
</template>
<script>
export default {
	name: "",
	data: () => ({

	}),
	props: {
		name: String,
		num: String,
	}
}
</script>
<style scoped>
.num {
	font-size: 29px;
}

.box {
	width: 30%;
	margin-left: 15px;
	text-align: center;
}

.name {
	font-size: 20px;
}
</style>
