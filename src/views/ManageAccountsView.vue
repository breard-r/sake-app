<script setup>
import { sortAccounts } from '../accounts';
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import ButtonGroupComponent from '../components/ButtonGroupComponent.vue';
import LayoutComponent from '../components/LayoutComponent.vue';

const router = useRouter();
const accounts = useStorage('sake-accounts', []);
const sortedAccounts = computed(() => sortAccounts(accounts.value));

const deleteAccount = (accountId) => {
	return router.push(`/delete-account/${accountId}`);
};
const setDefaultAccount = (accountId) => {
	accounts.value = accounts.value.map((a) => {
		a.isDefault = a.id === accountId;
		return a;
	});
};
const toMainView = () => {
	return router.push('/');
};
</script>

<template>
	<LayoutComponent>
		<h1>{{ $t("manageAccounts.title") }}</h1>

		<table class="table">
				<tbody>
					<tr v-for="account in sortedAccounts">
						<th class="text-end align-middle">
							<span class="badge text-bg-primary" v-if="account.isDefault">{{ $t("manageAccounts.isDefault") }}</span>
							{{ account.localPart }}@{{ account.domain }}
						</th>
						<th>
							<button type="button" class="btn btn-primary me-2" @click="setDefaultAccount(account.id)" v-if="!account.isDefault">{{ $t("manageAccounts.setDefault") }}</button>
							<button type="button" class="btn btn-danger" @click="deleteAccount(account.id)">{{ $t("manageAccounts.delete") }}</button>
						</th>
					</tr>
				</tbody>
			</table>

		<ButtonGroupComponent>
			<button type="button" class="btn btn-secondary" @click="toMainView">{{ $t("manageAccounts.close") }}</button>
		</ButtonGroupComponent>
	</LayoutComponent>
</template>
