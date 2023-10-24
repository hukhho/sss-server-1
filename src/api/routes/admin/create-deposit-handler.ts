import { Request, Response } from 'express'
import { EntityManager } from 'typeorm'
import { Deposit } from '../../../models/deposit'
import { time } from 'console'


type DepositInput = {
    method: string
    fiat_amount: number
    txn: string
}
const timeNow = () => {
    const date = new Date();
    return date.getTime();
}
const mockDepositData = {
    method: "Bank Transfer CON CAC 3",
    fiat_amount: 800000,
    txn: "txn_111111" + timeNow(),
}

export default async (req: Request, res: Response): Promise<void> => {
    const depositService = req.scope.resolve("depositService")

    const depositData: DepositInput = Object.assign({}, req.body);
  
    const deposit = await depositService.create(depositData).catch((err) => {
        res.status(500).json({ error: err });
    })

    res.json({
        result: deposit
    })
}
