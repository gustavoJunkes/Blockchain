import * as crypto from 'crypto'
import { Transaction } from './Transaction.js';

/**
 * This class represents a transaction in the chain.
 * 
 */
export class Block {
    public nonce = Math.random();
    private previousBlock: string; // should we store only the header (in hash) of the previous block?
    private transaction: Transaction;
    private date;

    constructor(
        previousBlock: string, // should we store only the header (in hash) of the previous block?
        transaction: Transaction,
        date = Date.now()
    ) {
        this.previousBlock = previousBlock;
        this.transaction = transaction;
        this.date = date;
    }

    get hash() {
        const stringfiedBlock = JSON.stringify(this);
        const hash = crypto.createHash('SHA256');
        hash.update(stringfiedBlock).end();
        return hash.digest('hex');
    }

    serialize(): string {
        return JSON.stringify({
            transaction: this.transaction,
            previousBlock: this.previousBlock, 
            date: this.date,
            nonce: this.nonce
        });
    }

    static deserialize(data: string): Block {
        const parsed = JSON.parse(data) as Block;
        const transactionParsed = new Transaction(parsed.transaction.amount, parsed.transaction.payer, parsed.transaction.receiver)
        var block = new Block(
            parsed.previousBlock,
            transactionParsed,
            parsed.date
        );
        block.nonce = parsed.nonce;
        return block;
    }
}