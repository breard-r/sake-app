<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { QrcodeStream, setZXingModuleOverrides } from 'vue-qrcode-reader';
import { sha256 } from '@noble/hashes/sha256';
import { Modal } from 'bootstrap';
import base32Encode from 'base32-encode';
import ButtonGroupComponent from '../components/ButtonGroupComponent.vue';
import LayoutComponent from '../components/LayoutComponent.vue';
import wasmFile from "../../node_modules/@sec-ant/zxing-wasm/dist/reader/zxing_reader.wasm?url";

const accounts = useStorage('sake-accounts', []);
const router = useRouter();
const localPart = ref('');
const separator = ref('+');
const domainName = ref('');
const privateKey = ref('');
const authorizedKeyLengths = [16, 32];
const state = reactive({
	QrCodeModal: null,
});

const errorMessageId = ref('');
const separatorErrorMessageId = ref('');
const localPartErrorMessageId = ref('');
const addrKeyErrorMessageId = ref('');

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
		resetErrorMessage();
		var hasError = false;
		var key = null;
		var accountId = null;
		if (separator.value.length != 1) {
			hasError = setErrorMessage('addAccount.error.invalidSeparator', separatorErrorMessageId);
		}
		try {
			if (localPart.value.includes(separator.value)) {
				throw new Error('addAccount.error.localPartSeparator');
			}
			accountId = `${localPart.value}@${domainName.value}`;
			for (const acc of accounts.value) {
				const comp = `${acc.localPart}@${acc.domain}`;
				if (accountId == comp) {
					throw new Error('addAccount.error.accountAlreadyExists');
				}
			}
		} catch (e) {
			console.log(e);
			hasError = setErrorMessage(e.message, localPartErrorMessageId);
		}
		try {
			key = base64Decode(privateKey.value);
			if (!authorizedKeyLengths.includes(key.length)) {
				throw new Error('addAccount.error.invalidKeyLength');
			}
		} catch (e) {
			hasError = setErrorMessage(e.message, addrKeyErrorMessageId);
		}
		if (!hasError && key && accountId) {
			const hash = sha256(accountId);
			const newAccount = {
				id: base32Encode(hash, 'RFC4648', { padding: false }).toLowerCase(),
				localPart: localPart.value,
				separator: separator.value,
				domain: domainName.value,
				key: key,
				isDefault: false,
			};
			accounts.value.push(newAccount);
			return toMainView();
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
onMounted(() => {
	state.QrCodeModal = new Modal('#qr-code-modal', {});
});
const scanQrCode = ref(false);
const showQrCodeScanner = (data) => {
	state.QrCodeModal.show();
	scanQrCode.value = true;
};
const hideQrCodeScanner = () => {
	scanQrCode.value = false;
	state.QrCodeModal.hide();
};
const onQrCodeDetected = (result_list) => {
	if (result_list.length >= 1) {
		privateKey.value = result_list[0].rawValue;
		hideQrCodeScanner();
	}
};
const onQrCodeError = (err) => {
	hideQrCodeScanner();
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
const setErrorMessage = (messageId, messageType) => {
	const messageIdClean = messageId.startsWith('addAccount.error.') ? messageId : 'addAccount.error.unknown';
	if (messageType) {
		messageType.value = messageIdClean;
	} else {
		errorMessageId.value = messageIdClean;
	}
	return true;
};
const resetFloatingErrorMessage = () => {
	errorMessageId.value = '';
};
const resetErrorMessage = () => {
	resetFloatingErrorMessage();
	separatorErrorMessageId.value = '';
	localPartErrorMessageId.value = '';
	addrKeyErrorMessageId.value = '';
};
</script>

<template>
	<LayoutComponent>
		<h1>{{ $t("addAccount.title") }}</h1>

		<div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="errorMessageId">
			{{ $t(errorMessageId) }}
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="resetFloatingErrorMessage"></button>
		</div>

		<div class="mb-3">
			<label class="form-label" for="new-addr-local-part">{{ $t("addAccount.localPart") }}</label>
			<input :class="{ 'form-control': true, 'is-invalid': localPartErrorMessageId}" type="text" id="new-addr-local-part" v-model="localPart">
			<div class="invalid-feedback" v-if="localPartErrorMessageId">{{ $t(localPartErrorMessageId) }}</div>
		</div>
		<div class="mb-3">
			<label class="form-label" for="new-addr-separator">{{ $t("addAccount.separator") }}</label>
			<input :class="{ 'form-control': true, 'is-invalid': separatorErrorMessageId}" type="text" id="new-addr-separator" v-model="separator">
			<div class="invalid-feedback" v-if="separatorErrorMessageId">{{ $t(separatorErrorMessageId) }}</div>
		</div>
		<div class="mb-3">
			<label class="form-label" for="new-addr-domain">{{ $t("addAccount.domainName") }}</label>
			<input class="form-control" type="text" id="new-addr-domain" placeholder="example.org" v-model="domainName">
		</div>
		<div class="mb-3">
			<label class="form-label" for="new-addr-key">{{ $t("addAccount.privateKey") }}</label>
			<div class="input-group">
				<input :class="{ 'form-control': true, 'is-invalid': addrKeyErrorMessageId}" type="text" id="new-addr-key" v-model="privateKey">
				<button class="btn btn-primary" type="button" @click="showQrCodeScanner">{{ $t("addAccount.scan") }}</button>
				<div class="invalid-feedback" v-if="addrKeyErrorMessageId">{{ $t(addrKeyErrorMessageId) }}</div>
			</div>
		</div>

		<div class="modal fade" id="qr-code-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h1 class="modal-title fs-5" id="staticBackdropLabel">{{ $t("addAccount.scanTitle") }}</h1>
						<button type="button" class="btn-close" aria-label="Close" @click="hideQrCodeScanner"></button>
					</div>
					<div class="modal-body">
						<qrcode-stream v-if="scanQrCode" @detect="onQrCodeDetected" @error="onQrCodeError"></qrcode-stream>
					</div>
				</div>
			</div>
		</div>

		<ButtonGroupComponent>
			<button type="button" class="btn btn-primary" :disabled="addDisabled" @click="addAccount">{{ $t("addAccount.addAccount") }}</button>
			<button type="button" class="btn btn-secondary" v-if="!cancellDisabled" @click="toMainView">{{ $t("addAccount.cancel") }}</button>
		</ButtonGroupComponent>
	</LayoutComponent>
</template>
