import './assets/main.sass';

import { createApp } from 'vue';
import { createI18n } from 'vue-i18n'
import App from './App.vue';
import router from './router';

import msg_en from './locales/en.json';

const messages = {
	en: msg_en,
};
const i18n = createI18n({
	locale: 'en',
	fallbackLocale: 'en',
	messages,
});

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');
