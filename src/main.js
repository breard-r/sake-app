import './assets/main.sass';

import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import App from './App.vue';
import router from './router';
import messages from '@intlify/unplugin-vue-i18n/messages';

const default_locale = 'en';
const stored_locale = useStorage('sake-locale', '');
if (!stored_locale.value) {
	stored_locale.value = default_locale;
}
document.documentElement.setAttribute('lang', stored_locale.value);

const i18n = createI18n({
	legacy: false,
	locale: stored_locale.value,
	fallbackLocale: default_locale,
	messages,
});

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');
