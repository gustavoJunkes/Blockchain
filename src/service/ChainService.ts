import { Block } from '../model/Block.js';
import { Chain } from '../model/Chain.js';

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
     * 
     * @returns true if the block was added to the chain, false otherwise.
     */
    addBlock(block: Block): boolean {
        // here we can add any final validation logic we need 
        // TODO: Validate the state of the chain.
        Chain.getInstance().chain.push(block);
        return true; // for now, always returns success
    }

}