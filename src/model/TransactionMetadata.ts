import { send } from "process";
import { Transaction } from "./Transaction";

export class TransactionMetadata {
    private transaction: Transaction;
    private signature: any;
    private senderPublicKey: string;

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