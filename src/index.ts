import { Wallet } from "./model/Wallet";
import { TransactionService } from "./service/TransactionService";

console.log("Begin...")

let gustavo = new Wallet();
let maria = new Wallet();

TransactionService.getInstance().createTransaction(10, gustavo.privateKey, gustavo.publicKey, maria.publicKey);