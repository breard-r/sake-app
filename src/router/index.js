import {createRouter, createMemoryHistory} from 'vue-router';
import { useStorage } from '@vueuse/core'

import MainView from '../views/MainView.vue';
import AddAccountView from '../views/AddAccountView.vue';

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
	]
});

export default router;
