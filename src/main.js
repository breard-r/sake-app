import './assets/main.sass';

import { allowedColorModes, allowedLocales } from './const';
import { getDefaultLocale } from './locales_utils';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import App from './App.vue';
import router from './router';
import messages from '@intlify/unplugin-vue-i18n/messages';

const setGlobalAttribute = (attrName, storageName, defaultValue, allowedValues) => {
	const stored_value = useStorage(storageName, '');
	if (!stored_value.value) {
		stored_value.value = defaultValue;
	}
	document.documentElement.setAttribute(attrName, stored_value.value);
	if (!allowedValues.includes(stored_value.value)) {
		stored_value.value = defaultValue;
	}
	return {
		'stored': stored_value,
		'defaultValue': defaultValue,
	};
};
const getDefaultColorMode = () => {
	const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	return darkMediaQuery.matches ? 'dark' : 'light';
};
const locale = setGlobalAttribute('lang', 'sake-locale', getDefaultLocale(), allowedLocales);
const colorMode = setGlobalAttribute('data-bs-theme', 'sake-color-mode', getDefaultColorMode(), allowedColorModes);

const i18n = createI18n({
	legacy: false,
	locale: locale.stored.value,
	fallbackLocale: locale.defaultValue,
	messages,
});

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');
