<script setup>
import { useRouter } from 'vue-router';
import { version } from '../../package.json';
import LayoutComponent from '../components/LayoutComponent.vue';
import ExternalLinkComponent from '../components/ExternalLinkComponent.vue';

const router = useRouter();
const mitLicenseUrl = 'https://spdx.org/licenses/MIT.html';
const apacheLicenseUrl = 'https://spdx.org/licenses/Apache-2.0.html';
const repoUrl = 'https://github.com/breard-r/sake-app';

const toMainView = () => {
	return router.push('/');
};
</script>

<template>
	<LayoutComponent>
		<h1 class="title is-1">About</h1>
		<h4 class="title is-4">Sub-Address KEy (SAKE) app</h4>
		<div class="block">
			<p>Version {{ version }}</p>
			<p>
				License: <ExternalLinkComponent :url="mitLicenseUrl" name="MIT" /> or <ExternalLinkComponent :url="apacheLicenseUrl" name="Apache 2.0" />
			</p>
			<p>
				Repository: <ExternalLinkComponent :url="repoUrl" :name="repoUrl" />
			</p>
		</div>
		<div class="block">
			<div class="buttons is-centered">
				<button class="button is-light" @click="toMainView">Close</button>
			</div>
		</div>
	</LayoutComponent>
</template>
