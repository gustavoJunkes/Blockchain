import * as crypto from 'crypto';
import { Block } from './Block';

export class Chain {

    private static instance: Chain;
    chain: Block[] = [];

    private constructor() {
        this.chain = [new Block("", new Transaction(1, "firstPayer", "firstReceiver"))]
    }

    /**
     * Used to add a block to the chain. Important: this should never be called without a proper validation of the block being added.
     * @param transaction the transaction operation itself.
     * @param publicKey the sender public key.
     * @param signature the signature of the transaction.
     */
    addBlock(transaction: Transaction, senderPublicKey: string, signature: any) {
         // here we validate if the transaction data is correct using the public key and signature of the haash - any change to the transaction would cause the hash to change, giving a different signature.
        const isTransactionValid = crypto.createVerify('SHA256').update(transaction.toString()).verify(senderPublicKey, signature);
        
        if (isTransactionValid) {
            const newBlock = new Block(this.lastBlock.hash, transaction);
            this.chain.push(newBlock);
        }

    }

    static getInstance(): Chain {
        if (!Chain.instance) {
            Chain.instance = new Chain();
        }
        return Chain.instance;
    }

    get lastBlock() {
        return this.chain[this.chain.length-1];
    }
}