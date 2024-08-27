import { send } from "process";
import { Transaction } from "./Transaction";

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

    serialize() {
        return JSON.stringify({
            transaction: this.transaction,
            signature: this.signature.toString('base64'), // Convert Buffer to base64 string
            senderPublicKey: this.senderPublicKey
        });
    }

    // Method to deserialize a JSON string back into a TransactionMetadata object
    static deserialize(data: string): TransactionMetadata {
        const parsed = JSON.parse(data);
        return new TransactionMetadata(
            parsed.transaction,
            Buffer.from(parsed.signature, 'base64'), // Convert base64 string back to Buffer
            parsed.senderPublicKey
        );
    }
}