<script setup>
import { sortAccounts } from '../accounts';
import { RouterLink, useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core'
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
		<h1 class="title is-1">Accounts</h1>
		<div class="block">
			<table class="table is-fullwidth">
				<tbody>
					<tr v-for="account in accounts">
						<th class="has-text-right is-vcentered">
							{{ account.localPart }}@{{ account.domain }}
						</th>
						<th>
							<button class="button is-danger" @click="deleteAccount(account.id)">Delete</button>
						</th>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="block">
			<div class="buttons is-centered">
				<button class="button is-light" @click="toMainView">Close</button>
			</div>
		</div>
	</LayoutComponent>
</template>
