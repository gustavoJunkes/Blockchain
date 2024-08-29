// import { TransactionMetadata } from "./model/TransactionMetadata";
// import { Wallet } from "./model/Wallet";
// import { MockNetworkFileSevice } from "./service/MockNetworkFileService";
// import { TransactionService } from "./service/TransactionService";
// import { ValidationService } from "./service/ValidationService";


// console.log("Begin...")

// /**
//  * Create transaction
//  */

// let gustavo = new Wallet();
// let maria = new Wallet();


// let newTransaction = TransactionService.getInstance().createTransaction(10, gustavo.privateKey, gustavo.publicKey, maria.publicKey);


// /**
//  * Simulate node that validate the transaction and broadcast it to the mempool - both local and in the network
//  */

// let transactions: TransactionMetadata[] = [newTransaction]; //MockNetworkFileSevice.getInstance().getTransactionsToValidate();

// for (let i = 0; i < transactions.length; i++) {
//     console.log("-----------------------------------------")
//     let transaction: TransactionMetadata = transactions[i];

//     console.log(`Validating transaction: ${JSON.stringify(transaction)}`);
//     console.log(transaction.signature)
//     let realBuffer = Buffer.from(transaction.signature);
//     let valid = ValidationService.getInstance().validateTransaction(transaction.transaction, transaction.senderPublicKey, realBuffer);

//     console.log(`Signature valid: ${valid}`);
// }

// ----------------------------------------------------------------------------------------------------

import { NetworkService } from "./service/network/NetworkService.js";
import { MockNetworkFileSevice } from "./service/MockNetworkFileService.js";
import { TransactionService } from "./service/TransactionService.js";
import { scheduleJob } from "node-schedule"
import { MiningService } from "./service/MiningService.js";
import { MemPoolService } from "./service/MemPoolService.js";
import { MemPool } from "./model/MemPool.js";
import { ValidationService } from "./service/ValidationService.js";
import { ChainService } from "./service/ChainService.js";

/**
 * Mine the transactions in the mempool
 * If the node receive a new block to the chain from the network, this process has to stop and restart.
 */
scheduleJob('*/30 * * * * *', () => {
    const transaction = MemPool.getInstance().transactions.pop();
    if (transaction) {
        const block = MiningService.getInstance().mine(transaction);
        ChainService.getInstance().addBlock(block);
    }
})

/**
 * Method used to test separated parts of the system.
 */
async function main() {

    // await NetworkService.getInstance().setupNode();

    const localWallet1 = MockNetworkFileSevice.getInstance().getWallets().filter((value) => value.id === 1)[0];
    console.log(localWallet1);

    const localWallet2 = MockNetworkFileSevice.getInstance().getWallets().filter((value) => value.id === 2)[0];
    console.log(localWallet2);
    
    const transaction = await TransactionService.getInstance().createTransaction(15, localWallet1.privateKey, localWallet1.publicKey, localWallet2.publicKey);

    ValidationService.getInstance().validateTransaction(transaction.transaction, transaction.senderPublicKey, transaction.signature);

}

main().catch(err => {
    console.error("Error starting application:", err);
    process.exit(1); 
});
