export class Transaction {
    amount: number;
    payer: string;
    receiver: string

    constructor(
        amount: number,
        payer: string,
        receiver: string
    ) {
        this.amount = amount;
        this.payer = payer;
        this.receiver = receiver;
    }

    toString() {
        return JSON.stringify(this);
    }
}