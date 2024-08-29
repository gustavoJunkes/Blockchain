import { send } from "process";
import { Transaction } from "./Transaction.js";

/**
 * Class used to manage the transactions as they are transmitted.
 * In the future, maybe put this content inside the transaction class itself.
 */
export class TransactionMetadata {
    public transaction: Transaction;
    public signature: Buffer;
    public senderPublicKey: string;

    constructor(
        transaction: Transaction,
        signature: any,
        senderPublicKey: string
    ) {
        this.transaction = transaction;
        this.signature = signature;
        this.senderPublicKey = senderPublicKey;
    }

    serialize(): string {
        return JSON.stringify({
            transaction: this.transaction,
            signature: this.signature.toString('base64'), 
            senderPublicKey: this.senderPublicKey
        });
    }

    static deserialize(data: string): TransactionMetadata {
        const parsed = JSON.parse(data);
        const transactionParsed = new Transaction(parsed.transaction.amount, parsed.transaction.payer, parsed.transaction.receiver)
        return new TransactionMetadata(
            transactionParsed,
            Buffer.from(parsed.signature, 'base64'), 
            parsed.senderPublicKey
        );
    }
}