import { Transaction } from "../model/Transaction.js";
import * as crypto from 'crypto';
import { MockNetworkFileSevice } from "./MockNetworkFileService.js";
import { TransactionMetadata } from "../model/TransactionMetadata.js";
import { NetworkService } from "./network/NetworkService.js";


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
    public async createTransaction(amount: number, senderPrivateKey: string, senderPublicKey: string, receiverPublicKey: string): Promise<TransactionMetadata> {
        
        const transaction = new Transaction(amount, senderPrivateKey, receiverPublicKey);
        const transactionHash = transaction.toString(); 
        const signer = crypto.createSign('SHA256').update(transactionHash).end();
        const signature = signer.sign(senderPrivateKey);

        let newTransactionMetadata = new TransactionMetadata(transaction, signature, senderPublicKey);

        // TODO: broadcast to network the new transaction to be validated by every node
        // MockNetworkFileSevice.getInstance().addTransactionToValidate(newTransactionMetadata);

        // broadcast the transaction to validate
        await NetworkService.getInstance().publicTransactionToValidation(newTransactionMetadata);

        // Chain.getInstance().addBlock(transaction, senderPublicKey, signature); // here, before adding the block to the chain we need to call other nodes to verify it. Then each node would add this block to their own chain
        return newTransactionMetadata;
    }
}