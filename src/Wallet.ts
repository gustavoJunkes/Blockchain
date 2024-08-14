import * as crypto from 'crypto';
import { format } from 'path';
import { Chain } from './Chain';

export class Wallet {
    public privateKey: string;
    public publicKey: string;
    
    constructor() {
        const keypair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        }); // rsa is a full encrypt and decrypt algo - using a key.
        this.privateKey = keypair.privateKey;
        this.publicKey = keypair.publicKey;
    }

    /**
     * Send a given value to another wallet
     * @param amount the amount being sent to another wallet
     * @param receiverPublicKey the public key of the receiver wallet
     */
    send(amount: number, receiverPublicKey: string) {
        const transaction = new Transaction(amount, this.privateKey, receiverPublicKey);
        const transactionHash = transaction.toString();

        const signer = crypto.createSign('SHA256');
        signer.update(transactionHash).end();

        const signature = signer.sign(this.privateKey);

        // TO DO: Verify if the sender has the amount being sent 

        Chain.getInstance().addBlock(transaction, this.publicKey, signature); // here, before adding the block to the chain we need to call other nodes to verify it. Then each node would add this block to their own chain
    }
}