import { Transaction } from './Transaction';
import { TransactionMetadata } from './TransactionMetadata';

/**
 * Data structure responsable for storing the transactions that were verified but are not mined yet
 */
export class MemPool {
    public transactions: TransactionMetadata[] = [];
    
    private static instance: MemPool;
    static getInstance(): MemPool {
        if (!MemPool.instance) {
            MemPool.instance = new MemPool();
        }
        return MemPool.instance;
    }
}