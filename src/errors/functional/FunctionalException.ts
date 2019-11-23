export class FunctionalException extends Error {

    protected errorType: string;
    protected description: string[];

    public constructor() {
        super();
    }

    public toString(): string {
        return JSON.stringify({
            description: this.description,
            timestamp: Date.now(),
            type: `Functional/${this.errorType}`,
        });
    }
}

