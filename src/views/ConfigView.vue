<script setup>
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import ButtonGroupComponent from '../components/ButtonGroupComponent.vue';
import LayoutComponent from '../components/LayoutComponent.vue';

const router = useRouter();
const stored_locale = useStorage('sake-locale', '');
const { t, locale } = useI18n({ useScope: 'global' });
const colorMode = useStorage('sake-color-mode');
const allowedColorModes = [
	'light',
	'dark',
];

const toMainView = () => {
	return router.push('/');
};

watch(locale, async (newLocale) => {
	stored_locale.value = newLocale;
	document.documentElement.setAttribute('lang', newLocale);
});
watch(colorMode, async (newColorMode) => {
	console.log(`new color mode: ${newColorMode}`);
	document.documentElement.setAttribute('data-bs-theme', newColorMode);
});
</script>

<template>
	<LayoutComponent>
		<h1>{{ $t("config.title") }}</h1>

		<div class="mb-3">
			<label class="form-label" for="app-language">{{ $t("config.language") }}</label>
			<select class="form-select" id="app-language" v-model="$i18n.locale">
				<option v-for="locale_id in $i18n.availableLocales" :key="`locale-${locale_id}`" :value="locale_id">{{ $t("locale_name", 1, { locale: locale_id}) }}</option>
			</select>
		</div>
		<div class="mb-3">
			<label class="form-label" for="app-color-mode">{{ $t("config.colorMode") }}</label>
			<select class="form-select" id="app-color-mode" v-model="colorMode">
				<option v-for="mode in allowedColorModes" :key="mode" :value="mode">{{ $t(`config.${mode}Theme`) }}</option>
			</select>
		</div>

		<ButtonGroupComponent>
			<button type="button" class="btn btn-secondary" @click="toMainView">{{ $t("about.close") }}</button>
		</ButtonGroupComponent>
	</LayoutComponent>
</template>
