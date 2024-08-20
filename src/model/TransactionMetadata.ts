import { send } from "process";
import { Transaction } from "./Transaction";

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
}