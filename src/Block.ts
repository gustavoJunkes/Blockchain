import * as crypto from 'crypto'

/**
 * This class represents a transaction in the chain.
 * 
 */
export class Block {
    nonce = Math.random();

    constructor(
        previousBlock: string, // should we store only the header (in hash) of the previous block?
        transaction: Transaction,
        date = Date.now()
    ) {}

    get hash() {
        const stringfiedBlock = JSON.stringify(this);
        const hash = crypto.createHash('SHA256');
        hash.update(stringfiedBlock).end();
        return hash.digest('hex');
    }
}