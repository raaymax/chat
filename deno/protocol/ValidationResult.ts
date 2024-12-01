
type ValidationError = {
	message: string;
	error: string;
	path?: string[];
};
export class ValidationResult {
	constructor(public valid: boolean, public errors?: ValidationError[]) {}

	getError() {
		if (!this.errors) {
			return null;
		}
		return this.errors;
	}

	static combine(results: ValidationResult[]) {
		const errors = results.map((r) => r.errors).filter(Boolean).flat()  as ValidationError[];
		return new ValidationResult(results.every((r) => r.valid), errors);
	}
}
