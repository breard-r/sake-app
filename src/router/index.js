import {createRouter, createMemoryHistory} from 'vue-router';
import { useStorage } from '@vueuse/core'

import MainView from '../views/MainView.vue';
import AddAccountView from '../views/AddAccountView.vue';
import DeleteAccountView from '../views/DeleteAccountView.vue';

const accounts = useStorage('sake-accounts', []);
const router = createRouter({
	history: createMemoryHistory(),
	routes: [
		{
			path: '/',
			component: MainView,
			beforeEnter: (to, from) => {
				if (!accounts.value.length) {
					return '/add-account';
				}
			}
		},
		{
			path: '/add-account',
			component: AddAccountView
		},
		{
			path: '/delete-account/:id',
			component: DeleteAccountView,
		},
	]
});

export default router;
