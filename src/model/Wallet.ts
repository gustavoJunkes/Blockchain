import * as crypto from 'crypto';
import { format } from 'path';
import { Chain } from './Chain';

export class Wallet {
    // TODO: save keys in a file so user dont loose them
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

}