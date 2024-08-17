/**
 * This class represents a transaction in the chain.
 * It should store ...
 */
export class Transaction {
    
    constructor(
        private amount: number,
        private payer: string,
        private receiver: string
    ) {}

    toString() {
        return JSON.stringify(this);
    }
}