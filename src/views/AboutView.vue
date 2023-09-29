<script setup>
import { useRouter } from 'vue-router';
import { version } from '../../package.json';
import ButtonGroupComponent from '../components/ButtonGroupComponent.vue';
import LayoutComponent from '../components/LayoutComponent.vue';
import ExternalLinkComponent from '../components/ExternalLinkComponent.vue';
import NavBarComponent from '../components/NavBarComponent.vue';

const router = useRouter();
const repoUrl = 'https://git.what.tf/rodolphe/sake-app';

const toMainView = () => {
	return router.push('/');
};
</script>

<template>
	<NavBarComponent />
	<LayoutComponent>
		<h1>{{ $t("about.title") }}</h1>
		<h4>{{ $t("about.name") }}</h4>

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

		<ButtonGroupComponent>
			<button type="button" class="btn btn-secondary" @click="toMainView">{{ $t("about.close") }}</button>
		</ButtonGroupComponent>
	</LayoutComponent>
</template>
