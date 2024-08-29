import * as crypto from 'crypto'
import { Transaction } from './Transaction';

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
}