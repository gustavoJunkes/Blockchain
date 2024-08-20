import { TransactionMetadata } from "./model/TransactionMetadata";
import { Wallet } from "./model/Wallet";
import { MockNetworkFileSevice } from "./service/MockNetworkFileService";
import { TransactionService } from "./service/TransactionService";
import { ValidationService } from "./service/ValidationService";

console.log("Begin...")

/**
 * Create transaction
 */
/*
let gustavo = new Wallet();
let maria = new Wallet();


TransactionService.getInstance().createTransaction(10, gustavo.privateKey, gustavo.publicKey, maria.publicKey);
*/

/**
 * Simulate node that validate the transaction and broadcast it to the mempool - both local and in the network
 */

let transactions: TransactionMetadata[] = MockNetworkFileSevice.getInstance().getTransactionsToValidate();

for (let i = 0; i <= transactions.length; i++) {
    console.log("-----------------------------------------")
    let transaction: TransactionMetadata = transactions[i];

    console.log(`Validating transaction: ${JSON.stringify(transaction)}`);
    console.log(transaction.signature)
    let realBuffer = Buffer.from(transaction.signature);
    let valid = ValidationService.getInstance().validateTransaction(transaction.transaction, transaction.senderPublicKey, realBuffer);

    console.log(`Signature valid: ${valid}`);
}

