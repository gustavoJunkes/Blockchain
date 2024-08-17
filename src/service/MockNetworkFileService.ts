import * as files from 'fs';
import { TransactionMetadata } from '../model/TransactionMetadata';
import { json } from 'stream/consumers';

export class MockNetworkFileSevice {
    private sourceFile = 'src/data.json';
    private static instance: MockNetworkFileSevice;

    static getInstance(): MockNetworkFileSevice {
        if (!MockNetworkFileSevice.instance) {
            MockNetworkFileSevice.instance = new MockNetworkFileSevice  ();
        }
        return MockNetworkFileSevice.instance;
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

        console.log(jsonContent)
        const newFileContent = JSON.stringify(jsonContent);

        console.log(newFileContent)
        files.writeFileSync(this.sourceFile, newFileContent);
    }
}