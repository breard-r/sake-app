<script setup>
defineProps(['url', 'name']);
</script>

<template>
	<a :href="url" target="_blank" rel="noopener noreferrer">{{ name }}</a>
</template>
