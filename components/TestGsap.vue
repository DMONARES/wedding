<template>
	<div class="box" ref="box"></div>
</template>

<script setup>
const { $gsap } = useNuxtApp();
const box = ref(null);

onMounted(() => {
	$gsap.to(box.value, {
		x: 100,
		duration: 1,
		rotation: 360,
	});
});
</script>

<style lang="scss" scoped>
.box {
	width: 100px;
	height: 100px;
	background-color: $highlight;
}
</style>
