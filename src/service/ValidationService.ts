import * as crypto from 'crypto';

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
     * Validate the signature and the balance.
     * @param transaction 
     * @param senderPublicKey 
     * @param signature 
     */
    public validateTransaction(transaction: Transaction, senderPublicKey: string, signature: any): boolean {
        const validSignature = crypto.createVerify('SHA256').update(transaction.toString()).verify(senderPublicKey, signature);

        // TODO: Validate balance of the sending wallet

        return validSignature // && balanceValid;
    }

}