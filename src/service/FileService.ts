import * as files from 'fs';
import { TransactionMetadata } from '../model/TransactionMetadata';
import { Wallet } from '../model/Wallet';
import { Peer } from '../model/Peer';

export class FileSevice {
    private sourceFile = 'src/data.json';
    private sourceFilePeerDiscovery = 'src/peers.json';
    private static instance: FileSevice;

    static getInstance(): FileSevice {
        if (!FileSevice.instance) {
            FileSevice.instance = new FileSevice();
        }
        return FileSevice.instance;
    }

    getTransactions() {
        const fileContent = files.readFileSync(this.sourceFile, 'utf8');
        const jsonContent = JSON.parse(fileContent);
    
        return jsonContent.transactions;
    }

    getBlocks() {
        const fileContent = files.readFileSync(this.sourceFile, 'utf8');
        const jsonContent = JSON.parse(fileContent);
    
        return jsonContent.blocks;
    }

    addTransactionToValidate(transactionData: TransactionMetadata) {
        const jsonContent = JSON.parse(files.readFileSync(this.sourceFile, 'utf8'));
        jsonContent.transactionsToValidate.push(transactionData);
        const newFileContent = JSON.stringify(jsonContent);

        files.writeFileSync(this.sourceFile, newFileContent);
    }

    getTransactionsToValidate() {
        const fileContent = files.readFileSync(this.sourceFile, 'utf8');
        const jsonContent = JSON.parse(fileContent);
    
        return jsonContent.transactionsToValidate;
    }

    saveWallet(wallet: Wallet) {
        const jsonContent = JSON.parse(files.readFileSync(this.sourceFile, 'utf8'));
        jsonContent.wallets.push(wallet);

        const newFileContent = JSON.stringify(jsonContent);
        files.writeFileSync(this.sourceFile, newFileContent);
    }

    getWallets(): Wallet[] {
        const fileContent = files.readFileSync(this.sourceFile, 'utf8');
        const jsonContent = JSON.parse(fileContent);
    
        return jsonContent.wallets;
    }

    savePeer(peer: {peerName: string, address: string, status: string, genesis: boolean}) {
        const jsonContent = JSON.parse(files.readFileSync(this.sourceFilePeerDiscovery, 'utf8'));
        jsonContent.peers.push(peer);
        const newFileContent = JSON.stringify(jsonContent);

        files.writeFileSync(this.sourceFilePeerDiscovery, newFileContent);
    }

    getPeers(): Peer[] {
        const fileContent = files.readFileSync(this.sourceFilePeerDiscovery, 'utf8');
        const jsonContent = JSON.parse(fileContent);
        return jsonContent.peers;
    }
}