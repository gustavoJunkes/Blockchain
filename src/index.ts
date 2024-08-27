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

import { networkInterfaces } from "os";
import { NetworkService } from "./service/network/NetworkService.js";
import { Wallet } from "./model/Wallet.js";
import { MockNetworkFileSevice } from "./service/MockNetworkFileService.js";
import { TransactionService } from "./service/TransactionService.js";

export class Index {}

async function main() {

    await NetworkService.getInstance().setupNode();

    const localWallet1 = MockNetworkFileSevice.getInstance().getWallets().filter((value) => value.id === 1)[0];
    console.log(localWallet1);

    const localWallet2 = MockNetworkFileSevice.getInstance().getWallets().filter((value) => value.id === 2)[0];
    console.log(localWallet2);

    await TransactionService.getInstance().createTransaction(15, localWallet1.privateKey, localWallet1.publicKey, localWallet2.publicKey);

}

main().catch(err => {
    console.error("Error starting application:", err);
    process.exit(1); // Exit the process if there's an error
});
