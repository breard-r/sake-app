<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core'

const accounts = useStorage('sake-accounts', []);
const router = useRouter();
const deleteId = useRoute().params.id;
const account = accounts.value.find((e) => e.id == deleteId);

const deleteAccount = () => {
	accounts.value = accounts.value.filter((e) => e.id !== deleteId);
	return toMainView();
};
const toMainView = () => {
	return router.push('/');
};
</script>

<template>
	<h1 class="title is-1">Delete account</h1>
	<p>You are about to delete the following account:</p>
	<p class="has-text-weight-semibold is-size-5">{{ account.localPart }}@{{ account.domain }}</p>
	<p>Are you sure?</p>
	<div class="buttons is-centered">
		<button class="button is-danger" @click="deleteAccount">Delete</button>
		<button class="button is-light" @click="toMainView">Cancel</button>
	</div>
</template>
