export function sortAccounts(accounts) {
	accounts.sort((a, b) => {
		const va = `${a.localPart}@${a.domain}`;
		const vb = `${b.localPart}@${b.domain}`;
		return va.localeCompare(vb);
	});
	return accounts;
}
