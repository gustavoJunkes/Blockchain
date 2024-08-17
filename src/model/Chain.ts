import * as crypto from 'crypto';
import { Block } from './Block';
import { Transaction } from './Transaction';

export class Chain {

    private static instance: Chain;
    chain: Block[] = [];

    private constructor() {
        this.chain = [new Block("", new Transaction(1, "firstPayer", "firstReceiver"))]
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