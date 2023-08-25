<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { QrcodeStream, setZXingModuleOverrides } from 'vue-qrcode-reader';
import { sha256 } from '@noble/hashes/sha256';
import base32Encode from 'base32-encode';
import LayoutComponent from '../components/LayoutComponent.vue';
import wasmFile from "../../node_modules/@sec-ant/zxing-wasm/dist/reader/zxing_reader.wasm?url";

const accounts = useStorage('sake-accounts', []);
const router = useRouter();
const localPart = ref('');
const separator = ref('+');
const domainName = ref('');
const privateKey = ref('');
const errorMessageId = ref('');
const authorizedKeyLengths = [16, 32];

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
		throw new Error('addAccount.error.invalidBase64');
	}
};

// Add account button
const addDisabled = computed(() => {
	const params = [
		localPart.value,
		separator.value,
		domainName.value,
		privateKey.value,
	];
	return !params.every((e) => e);
});
const addAccount = () => {
	if (!addDisabled.value) {
		try {
			if (separator.value.length != 1) {
				throw new Error('addAccount.error.invalidSeparator');
			}
			const key = base64Decode(privateKey.value);
			if (!authorizedKeyLengths.includes(key.length)) {
				throw new Error('addAccount.error.invalidKeyLength');
			}
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
			errorMessageId.value = e.message;
		}
	}
};

// QR code reader
setZXingModuleOverrides({
	locateFile: (path, prefix) => {
		if (path.endsWith(".wasm")) {
			return wasmFile;
		}
		return prefix + path;
	},
});
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
const onQrCodeError = (err) => {
	if (err.name === 'NotAllowedError') {
		setErrorMessage('addAccount.error.cameraNotAllowed');
	} else if (err.name === 'NotFoundError') {
		setErrorMessage('addAccount.error.cameraNotFound');
	} else if (err.name === 'NotSupportedError' || err.name === 'InsecureContextError') {
		setErrorMessage('addAccount.error.cameraInsecureContext');
	} else if (err.name === 'NotReadableError') {
		setErrorMessage('addAccount.error.cameraNotReadable');
	} else if (err.name === 'OverconstrainedError') {
		setErrorMessage('addAccount.error.cameraOverconstrained');
	} else if (err.name === 'StreamApiNotSupportedError') {
		setErrorMessage('addAccount.error.cameraStreamApiNotSupported');
	} else {
		setErrorMessage('addAccount.error.unknown');
		console.log(`${err.name}: ${err.value}`);
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
const setErrorMessage = (messageId) => {
	if (messageId.startsWith('addAccount.error.')) {
		errorMessageId.value = messageId;
	} else {
		errorMessageId.value = 'addAccount.error.unknown';
	}
};
const resetErrorMessage = () => {
	errorMessageId.value = '';
};
</script>

<template>
	<LayoutComponent>
		<h1 class="title is-1">{{ $t("addAccount.title") }}</h1>
		<div class="notification is-danger is-light" v-if="errorMessageId">
			<button class="delete" @click="resetErrorMessage"></button>
			{{ $t(errorMessageId) }}
		</div>
		<div class="container" id="new-account-error-msg-container"></div>
		<div class="field">
			<label class="label" for="new-addr-local-part">{{ $t("addAccount.localPart") }}</label>
			<div class="control">
				<input class="input" type="text" id="new-addr-local-part" v-model="localPart">
			</div>
		</div>
		<div class="field">
			<label class="label" for="new-addr-separator">{{ $t("addAccount.separator") }}</label>
			<div class="control">
				<input class="input" type="text" id="new-addr-separator" v-model="separator">
			</div>
		</div>
		<div class="field">
			<label class="label" for="new-addr-domain">{{ $t("addAccount.domainName") }}</label>
			<div class="control">
				<input class="input" type="text" id="new-addr-domain" placeholder="example.org" v-model="domainName">
			</div>
		</div>
		<label class="label" for="new-addr-key">{{ $t("addAccount.privateKey") }}</label>
		<div class="field has-addons">
			<div class="control is-expanded">
				<input class="input" type="text" id="new-addr-key" v-model="privateKey">
			</div>
			<p class="control">
				<a class="button is-primary" @click="showQrCodeScanner">{{ $t("addAccount.scan") }}</a>
			</p>
		</div>
		<qrcode-stream v-if="scanQrCode" @detect="onQrCodeDetected" @error="onQrCodeError"></qrcode-stream>
		<div class="buttons is-centered">
			<button class="button is-primary" :disabled="addDisabled" @click="addAccount">{{ $t("addAccount.addAccount") }}</button>
			<button class="button is-light" v-if="!cancellDisabled" @click="toMainView">{{ $t("addAccount.cancel") }}</button>
		</div>
	</LayoutComponent>
</template>
