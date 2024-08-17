import * as crypto from 'crypto';
import { MemPoolService } from './MemPoolService';
import { Transaction } from '../model/Transaction';

/**
 * Here we validate transactions
 */
export class ValidationService {

    private static instance: ValidationService;

    static getInstance(): ValidationService {
        if (!ValidationService.instance) {
            ValidationService.instance = new ValidationService();
        }
        return ValidationService.instance;
    }

    /**
     * Entrypoint for transaction validation.
     * Validate the signature and the balance.
     * At the end, broadcast the transaction for the mempool.
     * @param transaction 
     * @param senderPublicKey 
     * @param signature 
     */
    public validateTransaction(transaction: Transaction, senderPublicKey: string, signature: any): boolean {
        const validSignature = crypto.createVerify('SHA256').update(transaction.toString()).verify(senderPublicKey, signature);
        // TODO: Validate balance of the sending wallet

        if (validSignature) {
            MemPoolService.getInstance().publishToMemPool
        }

        return validSignature // && balanceValid;
    }

}