import { Request, Response } from 'express'
import { EntityManager } from 'typeorm'
import { Deposit } from '../../../models/deposit'

export default async (req: Request, res: Response): Promise<void> => {
  const depositService = req.scope.resolve("depositService")

  res.json({

    deposits: await depositService.list(),
  })
}
