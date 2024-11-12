import { MemPool } from "../model/MemPool.js";
import { Transaction } from '../model/Transaction';
import { TransactionMetadata } from "../model/TransactionMetadata.js";

/**
 * Here we manage the Memory Pool.
 * - Each node has a version of the memPool.
 */
export class MemPoolService {

    private static instance: MemPoolService;

    static getInstance(): MemPoolService {
        if (!MemPoolService.instance) {
            MemPoolService.instance = new MemPoolService();
        }
        return MemPoolService.instance;
    }

    /**
     * Publish the given transaction to the network memPool and add it to the local memPool.
     * Each node is responsible for validating the transactions received and add to its local mempool.
     * @param transaction 
     */
    public publishToMemPool(transaction: TransactionMetadata) {
        this.addToMemPool(transaction); 

        // TODO: publish this transaction to the network?
    }

    /**
     * Add the given transaction to the local memPool.
     * @param transaction 
     */
    public addToMemPool(transaction: TransactionMetadata) {
        MemPool.getInstance().transactions.push(transaction);
    }

    /**
     * Remove the given transaction from the local memPool.
     * @param transaction 
     */
    public removeFromMemPool(transaction: TransactionMetadata) {
        MemPool.getInstance().transactions = MemPool.getInstance().transactions.filter(item => item !== transaction);
    }
}