import { Request, Response } from 'express'
import { EntityManager } from 'typeorm'
import { Deposit } from '../../../models/deposit'

export default async (req: Request, res: Response): Promise<void> => {
  const depositService = req.scope.resolve("depositService")
  const { user_id, customer_id, txn } = req.query;

  // Create a selector based on the query parameters
  const selector = {
    txn,
  };

  res.json({
    deposits: await depositService.list(selector),
  })
}
