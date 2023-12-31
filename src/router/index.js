import {createRouter, createMemoryHistory} from 'vue-router';
import { useStorage } from '@vueuse/core';

import MainView from '../views/MainView.vue';
import AboutView from '../views/AboutView.vue';
import AddAccountView from '../views/AddAccountView.vue';
import ConfigView from '../views/ConfigView.vue';
import DeleteAccountView from '../views/DeleteAccountView.vue';
import ManageAccountsView from '../views/ManageAccountsView.vue';

const accounts = useStorage('sake-accounts', []);
const requireAccounts = () => {
	if (!accounts.value.length) {
		return '/add-account';
	}
};
const router = createRouter({
	history: createMemoryHistory(),
	routes: [
		{
			path: '/',
			name: 'main',
			component: MainView,
			beforeEnter: requireAccounts,
		},
		{
			path: '/about',
			name: 'about',
			component: AboutView,
		},
		{
			path: '/add-account',
			name: 'add-account',
			component: AddAccountView,
		},
		{
			path: '/config',
			name: 'config',
			component: ConfigView,
		},
		{
			path: '/delete-account/:id',
			name: 'delete-account',
			component: DeleteAccountView,
		},
		{
			path: '/manage-accounts',
			name: 'manage-accounts',
			component: ManageAccountsView,
			beforeEnter: requireAccounts,
		},
	]
});

export default router;
