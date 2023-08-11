<script setup>
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import LayoutComponent from '../components/LayoutComponent.vue';

const router = useRouter();
const stored_locale = useStorage('sake-locale', '');
const { t, locale } = useI18n({ useScope: 'global' });

const toMainView = () => {
	return router.push('/');
};

watch(locale, async (newLocale) => {
	stored_locale.value = newLocale;
});
</script>

<template>
	<LayoutComponent>
		<h1 class="title is-1">{{ $t("config.title") }}</h1>
		<div class="field">
			<label class="label" for="app-language">{{ $t("config.language") }}</label>
			<div class="control">
				<div class="select is-fullwidth">
					<select id="app-language" v-model="$i18n.locale">
						<option v-for="locale_id in $i18n.availableLocales" :key="`locale-${locale_id}`" :value="locale_id">{{ $t("locale_name", 1, { locale: locale_id}) }}</option>
					</select>
				</div>
			</div>
		</div>
		<div class="buttons is-centered">
			<button class="button is-light" @click="toMainView">{{ $t("config.close") }}</button>
		</div>
	</LayoutComponent>
</template>
