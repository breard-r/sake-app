<script setup>
import { ref, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core'
import { hmac } from '@noble/hashes/hmac';
import { sha256 } from '@noble/hashes/sha256';
import base32Encode from 'base32-encode';

const router = useRouter();
const accounts = useStorage('sake-accounts', []);
accounts.value.sort((a, b) => {
	const va = `${a.localPart}@${a.domain}`;
	const vb = `${b.localPart}@${b.domain}`;
	return va.localeCompare(vb);
});
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
	return '';
});
const deleteAccount = () => {
	return router.push(`/delete-account/${selectedAccountId.value}`);
};
const copyAddr = () => {
	navigator.clipboard.writeText(generatedAddr.value);
};
</script>

<template>
	<h1 class="title is-1">New email address</h1>
	<label class="label" for="account-name">Account</label>
	<div class="field has-addons">
		<div class="control is-expanded">
			<div class="select is-fullwidth">
				<select id="account-name" v-model="selectedAccountId">
					<option v-for="account in accounts" :key="account.id" :value="account.id">{{ account.localPart }}@{{ account.domain }}</option>
				</select>
			</div>
		</div>
		<p class="control">
			<a class="button is-danger" @click="deleteAccount">Delete</a>
		</p>
		<p class="control">
			<RouterLink to="/add-account" class="button is-primary">New</RouterLink>
		</p>
	</div>
	<div class="field">
		<label class="label" for="sub-addr-name">Name</label>
		<div class="control">
			<input class="input" type="text" id="sub-addr-name" placeholder="Text input" v-model="subAddrName">
		</div>
	</div>
	<label class="label" for="generated-addr">Address</label>
	<div class="field has-addons">
		<div class="control is-expanded">
			<input class="input" type="text" id="generated-addr" v-model="generatedAddr" disabled>
		</div>
		<p class="control">
			<a class="button is-primary" @click="copyAddr">Copy</a>
		</p>
	</div>
</template>
