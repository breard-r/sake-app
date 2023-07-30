<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core'
import { sha256 } from '@noble/hashes/sha256';
import base32Encode from 'base32-encode';

const accounts = useStorage('sake-accounts', []);
const router = useRouter();
const localPart = ref('');
const separator = ref('+');
const domainName = ref('');
const privateKey = ref('');

const base64Decode = (str_b64) => {
	const raw_str = atob(str_b64);
	const length = raw_str.length;
	var b = [];
	for (var i = 0; i < length; i++) {
		b.push(raw_str.charCodeAt(i));
	}
	return b;
};

// Add account button
const addDisabled = computed(() => {
	const params = [
		localPart.value,
		separator.value.length == 1,
		domainName.value,
		privateKey.value
	];
	return !params.every((e) => e);
});
const addAccount = () => {
	if (!addDisabled.value) {
		try {
			const key = base64Decode(privateKey.value);
			const hash = sha256(`${localPart.value}@${domainName.value}`);
			const newAccount = {
				id: base32Encode(hash, 'RFC4648', { padding: false }).toLowerCase(),
				localPart: localPart.value,
				separator: separator.value,
				domain: domainName.value,
				key: key,
			};
			accounts.value.push(newAccount);
			return router.push('/');
		} catch (e) {
			console.log(e);
		}
	}
};

// Cancel button
const cancellDisabled = computed(() => {
	return !accounts.value.length;
});
const toMainView = () => {
	return router.push('/');
};
</script>

<template>
	<h1 class="title is-1">Add a new account</h1>
	<div class="container" id="new-account-error-msg-container"></div>
	<div class="field">
		<label class="label" for="new-addr-local-part">Local part</label>
		<div class="control">
			<input class="input" type="text" id="new-addr-local-part" v-model="localPart">
		</div>
	</div>
	<div class="field">
		<label class="label" for="new-addr-separator">Separator</label>
		<div class="control">
			<input class="input" type="text" id="new-addr-separator" v-model="separator">
		</div>
	</div>
	<div class="field">
		<label class="label" for="new-addr-domain">Domain name</label>
		<div class="control">
			<input class="input" type="text" id="new-addr-domain" placeholder="example.org" v-model="domainName">
		</div>
	</div>
	<div class="field">
		<label class="label" for="new-addr-key">Private key</label>
		<div class="control">
			<input class="input" type="text" id="new-addr-key" v-model="privateKey">
		</div>
	</div>
	<div class="buttons is-centered">
		<button class="button is-success" :disabled="addDisabled" @click="addAccount">Add account</button>
		<button class="button is-light" v-if="!cancellDisabled" @click="toMainView">Cancel</button>
	</div>
</template>
