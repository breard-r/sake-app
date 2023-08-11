<script setup>
import { useRouter } from 'vue-router';
import { version } from '../../package.json';
import LayoutComponent from '../components/LayoutComponent.vue';
import ExternalLinkComponent from '../components/ExternalLinkComponent.vue';

const router = useRouter();
const repoUrl = 'https://github.com/breard-r/sake-app';

const toMainView = () => {
	return router.push('/');
};
</script>

<template>
	<LayoutComponent>
		<h1 class="title is-1">{{ $t("about.title") }}</h1>
		<h4 class="subtitle is-4">{{ $t("about.name") }}</h4>
		<div class="block">
			<i18n-t scope="global" keypath="about.version" tag="p">
				<template v-slot:version>{{ version }}</template>
			</i18n-t>
			<i18n-t scope="global" keypath="about.license" tag="p">
				<template v-slot:mit>
					<ExternalLinkComponent :url="$t('about.license_mit_url')" name="MIT" />
				</template>
				<template v-slot:apache>
					<ExternalLinkComponent :url="$t('about.license_apache_url')" name="Apache 2.0" />
				</template>
			</i18n-t>
			<i18n-t scope="global" keypath="about.repository" tag="p">
				<template v-slot:url>
					<ExternalLinkComponent :url="repoUrl" :name="repoUrl" />
				</template>
			</i18n-t>
		</div>
		<div class="block">
			<div class="buttons is-centered">
				<button class="button is-light" @click="toMainView">{{ $t("about.close") }}</button>
			</div>
		</div>
	</LayoutComponent>
</template>
