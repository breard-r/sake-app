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

const toMainView = () => {
	return router.push('/');
};

watch(locale, async (newLocale) => {
	stored_locale.value = newLocale;
	document.documentElement.setAttribute('lang', newLocale);
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

		<ButtonGroupComponent>
			<button type="button" class="btn btn-secondary" @click="toMainView">{{ $t("about.close") }}</button>
		</ButtonGroupComponent>
	</LayoutComponent>
</template>
