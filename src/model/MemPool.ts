import { Transaction } from './Transaction';

/**
 * Data structure responsable for storing the transactions that were verified but are not yet mined
 */
export class MemPool {
    public transactions: Transaction[] = [];
    
    private static instance: MemPool;
    static getInstance(): MemPool {
        if (!MemPool.instance) {
            MemPool.instance = new MemPool();
        }
        return MemPool.instance;
    }
}