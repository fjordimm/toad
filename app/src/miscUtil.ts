
export function stringHash(input: string) {
	let hash: number = 0;

	if (input.length === 0) {
		return hash;
	}

	for (let i = 0; i < input.length; i++) {
		const chr: number = input.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0;
	}

	return hash;
}
