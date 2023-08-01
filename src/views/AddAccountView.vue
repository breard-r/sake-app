<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core'
import { QrcodeStream } from 'vue-qrcode-reader'
import { sha256 } from '@noble/hashes/sha256';
import base32Encode from 'base32-encode';
import LayoutComponent from '../components/LayoutComponent.vue';

const accounts = useStorage('sake-accounts', []);
const router = useRouter();
const localPart = ref('');
const separator = ref('+');
const domainName = ref('');
const privateKey = ref('');
const errorMessage = ref('');

const base64Decode = (str_b64) => {
	try {
		const raw_str = atob(str_b64);
		const length = raw_str.length;
		var b = [];
		for (var i = 0; i < length; i++) {
			b.push(raw_str.charCodeAt(i));
		}
		return b;
	} catch (e) {
		throw new Error('The key must be a valid base64 string.');
	}
};

// Add account button
const addDisabled = computed(() => {
	const params = [
		localPart.value,
		separator.value,
		domainName.value,
		privateKey.value
	];
	return !params.every((e) => e);
});
const addAccount = () => {
	if (!addDisabled.value) {
		try {
			if (separator.value.length != 1) {
				throw new Error('The separator must be a single character.');
			}
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
			return toMainView();
		} catch (e) {
			errorMessage.value = e.message;
		}
	}
};

// QR code reader
const scanQrCode = ref(false);
const showQrCodeScanner = (data) => {
	scanQrCode.value = true;
};
const onQrCodeDetected = (result_list) => {
	if (result_list.length >= 1) {
		privateKey.value = result_list[0].rawValue;
		scanQrCode.value = false;
	}
};

// Cancel button
const cancellDisabled = computed(() => {
	return !accounts.value.length;
});
const toMainView = () => {
	return router.push('/');
};

// Error message
const resetErrorMessage = () => {
	errorMessage.value = '';
};
</script>

<template>
	<LayoutComponent>
		<h1 class="title is-1">New account</h1>
		<div class="notification is-danger is-light" v-if="errorMessage">
			<button class="delete" @click="resetErrorMessage"></button>
			{{ errorMessage }}
		</div>
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
		<label class="label" for="new-addr-key">Private key</label>
		<div class="field has-addons">
			<div class="control is-expanded">
				<input class="input" type="text" id="new-addr-key" v-model="privateKey">
			</div>
			<p class="control">
				<a class="button is-primary" @click="showQrCodeScanner">Scan</a>
			</p>
		</div>
		<qrcode-stream v-if="scanQrCode" @detect="onQrCodeDetected"></qrcode-stream>
		<div class="buttons is-centered">
			<button class="button is-primary" :disabled="addDisabled" @click="addAccount">Add account</button>
			<button class="button is-light" v-if="!cancellDisabled" @click="toMainView">Cancel</button>
		</div>
	</LayoutComponent>
</template>
