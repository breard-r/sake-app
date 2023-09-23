<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import ButtonGroupComponent from '../components/ButtonGroupComponent.vue';
import LayoutComponent from '../components/LayoutComponent.vue';

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
	<LayoutComponent>
		<h1>{{ $t("deleteAccount.title") }}</h1>

		<p>{{ $t("deleteAccount.account") }}</p>
		<p class="has-text-weight-semibold is-size-5">{{ account.localPart }}@{{ account.domain }}</p>
		<p>{{ $t("deleteAccount.confirm") }}</p>

		<ButtonGroupComponent>
			<button type="button" class="btn btn-danger" @click="deleteAccount">{{ $t("deleteAccount.delete") }}</button>
			<button type="button" class="btn btn-secondary" @click="toMainView">{{ $t("deleteAccount.cancel") }}</button>
		</ButtonGroupComponent>
	</LayoutComponent>
</template>
