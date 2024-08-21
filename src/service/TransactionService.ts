import { Transaction } from "../model/Transaction";
import * as crypto from 'crypto';
import { MockNetworkFileSevice } from "./MockNetworkFileService";
import { TransactionMetadata } from "../model/TransactionMetadata";


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
    public createTransaction(amount: number, senderPrivateKey: string, senderPublicKey: string, receiverPublicKey: string): TransactionMetadata {
        
        const transaction = new Transaction(amount, senderPrivateKey, receiverPublicKey);
        const transactionHash = transaction.toString(); 

        console.log("transaction hash: " + transactionHash)
        console.log("senderPrivateKey: " + senderPrivateKey)
        const signer = crypto.createSign('SHA256').update(transactionHash).end();
        const signature = signer.sign(senderPrivateKey);

        let newTransactionMetadata = new TransactionMetadata(transaction, signature, senderPublicKey);

        // TODO: broadcast to network the new transaction to be validated by every node
        MockNetworkFileSevice.getInstance().addTransactionToValidate(newTransactionMetadata);
        // Chain.getInstance().addBlock(transaction, senderPublicKey, signature); // here, before adding the block to the chain we need to call other nodes to verify it. Then each node would add this block to their own chain
        return newTransactionMetadata;
    }
}