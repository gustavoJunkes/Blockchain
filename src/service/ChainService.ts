import * as crypto from 'crypto';
import { ValidationService } from './ValidationService';
import { Block } from '../model/Block';
import { Chain } from '../model/Chain';

/**
 * Here we manage the chain.
 * Important: neve add anything to the chain that has not been verified and mined.
 */
export class ChainService {

    private static instance: ChainService;

    static getInstance(): ChainService {
        if (!ChainService.instance) {
            ChainService.instance = new ChainService();
        }
        return ChainService.instance;
    }

    /**
     * Used to add a block to the chain. Important: this should never be called without a proper validation of the block being added.
     * When receiving a new block we always verify if the chain is matching before adding it to our local chain.
     * @param transaction the transaction operation itself.
     * @param publicKey the sender public key.
     * @param signature the signature of the transaction.
     */
    addBlock(transaction: Transaction, senderPublicKey: string, signature: any) {
        // here we validate if the transaction data is correct using the public key and signature of the haash - any change to the transaction would cause the hash to change, giving a different signature.
        // const isTransactionValid = ValidationService.getInstance().validateTransaction(transaction, senderPublicKey, signature);
        
        // if (isTransactionValid) {
        //     const newBlock = new Block(Chain.getInstance().lastBlock.hash, transaction);
        //     this.mineBlock(newBlock.nonce);
        //     Chain.getInstance().chain.push(newBlock);
        // }

    }

}