import * as crypto from 'crypto';
import { Block } from '../model/Block.js';
import { Chain } from '../model/Chain.js';
import { TransactionMetadata } from '../model/TransactionMetadata.js';

/**
 * Here we manage the mining related actions.
 */
export class MiningService {

    private static instance: MiningService;

    static getInstance(): MiningService {
        if (!MiningService.instance) {
            MiningService.instance = new MiningService();
        }
        return MiningService.instance;
    }

    /**
     * Mine the transaction using the proof of work algorithm.
     * @param transaction 
     */
    mine(transaction: TransactionMetadata): Block {
        let block = new Block(Chain.getInstance().lastBlock.hash, transaction.transaction);
        block.nonce = this.proofOfWork(block.nonce);
        return block;
    }

    
    /**
     * Proof of work method.
     * This method deal with the double spend issue. If One subject tries to make the same transaction twice simultaneously, it will ensure they are different using the nonce
     * We try to find a number that when added to the nonce will result 
     * @param nonce 
     * @returns return the value that added to the nounce
     */
    private proofOfWork(nonce: number): number {
        let solution = 1;

        while(true) {
            const attempt = crypto.createHash('MD5').update((nonce + solution).toString()).end().digest('hex');
            
            if (attempt.substring(0,4) === '0000') {
                console.log("Solved using: " + solution);
                return nonce + solution;
            }
            solution++;
        }
    }
}