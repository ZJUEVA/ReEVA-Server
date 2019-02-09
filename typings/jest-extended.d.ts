declare namespace jest {
	interface Matchers<R> {
		toBeString(): R
		toBeArray(): R
		toContainKeys(x: string[]): R
	}
}
