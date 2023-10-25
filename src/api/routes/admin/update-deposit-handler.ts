import { Request, Response } from 'express'
import { EntityManager } from 'typeorm'
import { Deposit } from '../../../models/deposit'
import { time } from 'console'


type DepositInput = {
    status: string
}

  
export default async (req: Request, res: Response): Promise<void> => {
    const depositService = req.scope.resolve("depositService")

    // const depositData: DepositInput = Object.assign({}, req.body);
    const id = req.params.id;
    console.log("id: ", id)
    const depositData: DepositInput = {
        status: "Chờ duyệt - Đã chuyển khoản",
    }

    const deposit = await depositService.update(id, depositData).catch((err) => {
        res.status(500).json({ error: err });
    })

    res.json({
        result: deposit
    })
}
