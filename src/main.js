import './assets/main.sass';

import { createApp } from 'vue';
import { createI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import App from './App.vue';
import router from './router';

import msg_en from './locales/en.json';
import msg_fr from './locales/fr.json';

const default_locale = 'en'
const stored_locale = useStorage('sake-locale', '');
if (!stored_locale.value) {
	stored_locale.value = default_locale
}

const messages = {
	en: msg_en,
	fr: msg_fr,
};
const i18n = createI18n({
	locale: stored_locale.value,
	fallbackLocale: default_locale,
	messages,
});

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');
