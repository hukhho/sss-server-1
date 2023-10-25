import { Request, Response } from 'express'
import { EntityManager } from 'typeorm'
import { Deposit } from '../../../models/deposit'
import { time } from 'console'


type DepositInput = {
    method: string
    fiat_amount: number
    typeTrans: string
    revicedName: string
    revicedBankName: string
    revicedBankNumber: string
}

function createTransactionNumber() {
    const timestamp = Date.now(); // Get the current timestamp in milliseconds
    const randomSuffix = Math.floor(Math.random() * 10000); // Generate a random 4-digit number

    // Combine the timestamp and random number to create a unique txn
    const txn = `${timestamp}-${randomSuffix}`;

    return txn;
}

// Example usage:
const generatedTxn = createTransactionNumber();
console.log(generatedTxn);

export default async (req: Request, res: Response): Promise<void> => {
    const depositService = req.scope.resolve("depositService")

    const depositData: DepositInput = Object.assign({ txn: createTransactionNumber() }, req.body);


    const deposit = await depositService.create(depositData).catch((err) => {
        res.status(500).json({ error: err });
    })

    res.json({
        result: deposit
    })
}
