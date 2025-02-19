import { NetworkService } from "./service/network/NetworkService.js";
import { FileSevice } from "./service/FileService.js";
import { TransactionService } from "./service/TransactionService.js";
import { scheduleJob } from "node-schedule"
import { MiningService } from "./service/MiningService.js";
import { MemPoolService } from "./service/MemPoolService.js";
import { MemPool } from "./model/MemPool.js";
import { ValidationService } from "./service/ValidationService.js";
import { ChainService } from "./service/ChainService.js";
import express, { Application } from 'express';
import { appRoutes } from './routes/app-routes.js';


const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 

app.use('/api/app', appRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;

/**
 * Method used to test separated parts of the system.
 */
async function main() {
    MiningService.getInstance();
    NetworkService.getInstance().setupNode();

}

main().catch(err => {
    console.error("Error starting application:", err);
    process.exit(1); 
});
