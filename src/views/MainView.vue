<script setup>
import { sortAccounts } from '../accounts';
import { ref, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { hmac } from '@noble/hashes/hmac';
import { sha256 } from '@noble/hashes/sha256';
import base32Encode from 'base32-encode';
import ButtonGroupComponent from '../components/ButtonGroupComponent.vue';
import LayoutComponent from '../components/LayoutComponent.vue';
import NavBarComponent from '../components/NavBarComponent.vue';

const router = useRouter();
const accounts = sortAccounts(useStorage('sake-accounts', []));
const selectedAccountId = ref(accounts.value[0].id);
const subAddrName = ref('');

const fromRawAccount = (raw_account) => {
	return {
		id: raw_account.id,
		localPart: raw_account.localPart,
		separator: raw_account.separator,
		domain: raw_account.domain,
		key: Uint8Array.from(raw_account.key),
	};
};
const generatedAddr = computed(() => {
	if (selectedAccountId.value && subAddrName.value) {
		const raw_account = accounts.value.find((e) => e.id == selectedAccountId.value);
		if (raw_account) {
			const account = fromRawAccount(raw_account);
			if (subAddrName.value.indexOf(account.separator) != -1) {
				subAddrName.value = subAddrName.value.replaceAll(account.separator, '');
			}
			if (subAddrName.value) {
				var hasher = hmac.create(sha256, account.key);
				hasher.update(account.localPart);
				hasher.update(account.separator);
				hasher.update(subAddrName.value);
				const mac = hasher.digest();
				const offset = mac[mac.length - 1] & 0xf;
				const reduced_mac = mac.slice(offset, offset + 5);
				const code = base32Encode(reduced_mac, 'RFC4648', { padding: false }).toLowerCase();
				return `${account.localPart}${account.separator}${subAddrName.value}${account.separator}${code}@${account.domain}`;
			}
		}
	}
	return '';
});
const copyAddr = () => {
	navigator.clipboard.writeText(generatedAddr.value);
};
const resetForm = () => {
	subAddrName.value = '';
};
</script>

<template>
	<NavBarComponent />
	<LayoutComponent>
		<h1>{{ $t("main.title") }}</h1>

		<div class="mb-3">
			<label class="form-label" for="account-name">{{ $t("main.account") }}</label>
			<select class="form-select" id="account-name" v-model="selectedAccountId">
				<option v-for="account in accounts" :key="account.id" :value="account.id">{{ account.localPart }}@{{ account.domain }}</option>
			</select>
		</div>

		<div class="mb-3">
			<label class="form-label" for="sub-addr-name">{{ $t("main.name") }}</label>
			<input class="form-control" type="text" id="sub-addr-name" :placeholder="$t('main.input')" v-model="subAddrName">
		</div>

		<div class="mb-3">
			<label class="form-label" for="generated-addr">{{ $t("main.address") }}</label>
			<input class="form-control" type="text" id="generated-addr" v-model="generatedAddr" disabled>
		</div>

		<ButtonGroupComponent>
			<button type="button" class="btn btn-primary" @click="copyAddr">{{ $t("main.copy") }}</button>
			<button type="button" class="btn btn-secondary" @click="resetForm">{{ $t("main.reset") }}</button>
		</ButtonGroupComponent>
	</LayoutComponent>
</template>
