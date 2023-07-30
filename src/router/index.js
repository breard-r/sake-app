import {createRouter, createMemoryHistory} from 'vue-router';

import MainView from '../views/MainView.vue';
import AddAccountView from '../views/AddAccountView.vue';

const router = createRouter({
	history: createMemoryHistory(),
	routes: [
		{path: '/', component: MainView},
		{path: '/add-account', component: AddAccountView},
	]
});

export default router;
