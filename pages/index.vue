<script setup>
const showPreloader = ref(true);

// const dmzArt = `
//  #####     #   #    ######
//  #    #    ## ##        #
//  #     #   # # #       #
//  #     #   #   #      #
//  #    #    #   #     #
//  #####     #   #    ######
// `;

const catArt = `
 /\\_/\\
( o.o )
 > ^ <
`;

onMounted(() => {
	setTimeout(() => {
		showPreloader.value = false;
		document.body.style.overflow = "auto";
	}, 5000);
	// console.log(dmzArt + "\n" + catArt);
	console.log(catArt);
});
</script>

<template>
	<div v-if="showPreloader" class="preloader-container"></div>

	<div v-else class="main-content">
		<HeroSection />
		<StorySection />
		<TimerSection />
		<ProgrammSection />
		<YandexMap />
		<div id="content-section" class="content-container">
			<MyForm />
		</div>
	</div>
</template>

<style>
html,
body {
	overflow: auto !important;
	height: auto !important;
}

.preloader-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 10000;
}

.main-content {
	position: relative;
}
</style>
