<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { hmac } from '@noble/hashes/hmac';
import { sha256 } from '@noble/hashes/sha256';
import base32Encode from 'base32-encode';

const accounts = [
	{
		id: 'bbca792e-0cf4-414f-8d6e-eea3df8e20b3',
		localPart: 'a',
		separator: '+',
		domain: 'example.org',
		key: Uint8Array.from([215, 91, 232, 137, 231, 202, 228, 248, 2, 95, 145, 117, 77, 55, 46, 161]),
	},
	{
		id: '6ff7bae6-6c6c-43d7-a75c-859e6ecbdbd8',
		localPart: 'b',
		separator: '+',
		domain: 'example.org',
		key: Uint8Array.from([215, 91, 232, 137, 231, 202, 228, 248, 2, 95, 145, 117, 77, 55, 46, 161]),
	},
];
const selectedAccountId = ref(accounts[0].id);
const subAddrName = ref('');

const generatedAddr = computed(() => {
	if (selectedAccountId.value && subAddrName.value) {
		const account = accounts.find((e) => e.id == selectedAccountId.value);
		if (account) {
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
			<a class="button is-danger">Delete</a>
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
