<script setup>
import { ref } from 'vue';
import MainView from "./views/MainView.vue";

const accounts = [
	{
		id: 'bbca792e-0cf4-414f-8d6e-eea3df8e20b3',
		localPart: 'a',
		separator: '+',
		domain: 'example.org',
		key: Uint8Array.from([215, 91, 232, 137, 231, 202, 228, 248, 2, 95, 145, 117, 77, 55, 46, 161]),
	},
	{
		id: '6ff7bae6-6c6c-43d7-a75c-859e6ecbdbd8',
		localPart: 'b',
		separator: '+',
		domain: 'example.org',
		key: Uint8Array.from([215, 91, 232, 137, 231, 202, 228, 248, 2, 95, 145, 117, 77, 55, 46, 161]),
	},
];
</script>

<template>
	<MainView :accounts="accounts" />
</template>
