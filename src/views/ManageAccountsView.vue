<script setup>
import { sortAccounts } from '../accounts';
import { RouterLink, useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import ButtonGroupComponent from '../components/ButtonGroupComponent.vue';
import LayoutComponent from '../components/LayoutComponent.vue';

const router = useRouter();
const accounts = sortAccounts(useStorage('sake-accounts', []));

const deleteAccount = (accountId) => {
	return router.push(`/delete-account/${accountId}`);
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
					<tr v-for="account in accounts">
						<th class="text-end align-middle">
							{{ account.localPart }}@{{ account.domain }}
						</th>
						<th>
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
