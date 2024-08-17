import { Chain } from "../model/Chain";
import * as crypto from 'crypto';


/**
 * Here we manage transactions
 */
export class TransactionService {

    private static instance: TransactionService;

    static getInstance(): TransactionService {
        if (!TransactionService.instance) {
            TransactionService.instance = new TransactionService();
        }
        return TransactionService.instance;
    }

    /**
     * Create a new transactions - entrypoint of the process of transaction creation.
     * 1. Create new transaction
     * 2. Sign the transaction
     * 3. Send to validation (external and internal)
     * ------------------------------------------------
     * Send a given value to another wallet
     * @param amount the amount being sent to another wallet
     * @param receiverPublicKey the public key of the receiver wallet
     */
    private createTransaction(amount: number, senderPrivateKey: string, senderPublicKey: string, receiverPublicKey: string) {
        const transaction = new Transaction(amount, senderPrivateKey, receiverPublicKey);
        const transactionHash = transaction.toString(); 

        const signature = crypto.createSign('SHA256').update(transactionHash).end().sign(senderPrivateKey)
        
        // TODO: broadcast to network the new transaction to be validated by every node
        
        // Chain.getInstance().addBlock(transaction, senderPublicKey, signature); // here, before adding the block to the chain we need to call other nodes to verify it. Then each node would add this block to their own chain
    }
}