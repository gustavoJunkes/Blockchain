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

app.use(express.json()); // To parse incoming JSON requests

// Setup routes
app.use('/api/app', appRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;

/**
 * Method used to test separated parts of the system.
 */
async function main() {

    if (/** is the genesis node */ true) {
        console.log("Genesis node setup...");
    } else if (/** is the 2nd node */ true) {
        console.log("Second node setup...");
    } else if (/** is the 3rd node */ true) {
        console.log("Third node setup...");
    }
    NetworkService.getInstance().setupNode();
    MiningService.getInstance().registerMiningSchedule();

}

main().catch(err => {
    console.error("Error starting application:", err);
    process.exit(1); 
});
