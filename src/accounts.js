export function sortAccounts(accounts) {
	accounts.value.sort((a, b) => {
		const va = `${a.localPart}@${a.domain}`;
		const vb = `${b.localPart}@${b.domain}`;
		return va.localeCompare(vb);
	});
	return accounts;
}
