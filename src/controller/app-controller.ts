import { Request, Response } from 'express';
import { FileSevice } from '../service/FileService.js';
import { TransactionService } from '../service/TransactionService.js';
import { ValidationService } from '../service/ValidationService.js';
import { Chain } from '../model/Chain.js';
import { MemPool } from '../model/MemPool.js';
import { MemPoolService } from '../service/MemPoolService.js';

/** 
 * Here we deal with new transactions done by this node.
 * 
 * - Endpoint to create new transaction.
 *
 */
export class AppController {

    public static async newTransaction(req: Request, res: Response) {
        const transactionReceived = req.body.transaction;

        console.log(transactionReceived)

        // find the demo wallets
        const localWallet1 = FileSevice.getInstance().getWallets().filter((value) => value.id === 1)[0]; 
        const localWallet2 = FileSevice.getInstance().getWallets().filter((value) => value.id === 2)[0];
        
        const transaction = await TransactionService.getInstance().createTransaction(transactionReceived.amount, localWallet1.privateKey, localWallet1.publicKey, localWallet2.publicKey);
    
        ValidationService.getInstance().validateTransaction(transaction.transaction, transaction.senderPublicKey, transaction.signature);        
        res.status(200).json("Transaction created with no errors.");
    }

    /**
     * Return the local chain.
     */
    public static async getChain(req: Request, res: Response) {
        const chain = Chain.getInstance().chain;
        res.status(200).json(chain);
    }

    /**
     * Return the content of the local memory pool.
     */
    public static async getMemPool(req: Request, res: Response) {
        const memPoolTransactions = MemPool.getInstance().transactions
        
        res.status(200).json(memPoolTransactions);
    }

}