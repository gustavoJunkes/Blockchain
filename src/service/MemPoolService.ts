import { MemPool } from "../model/MemPool";

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
     * @param transaction 
     */
    public publishToMemPool(transaction: Transaction) {
        this.addToMemPool(transaction); 

        // TODO: publish this transaction to the network
    }

    /**
     * Add the given transaction to the local memPool.
     * @param transaction 
     */
    public addToMemPool(transaction: Transaction) {
        MemPool.getInstance().transactions.push(transaction);
    }
}