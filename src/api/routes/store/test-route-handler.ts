import { Request, Response } from 'express'
import { EntityManager } from 'typeorm'
import { Deposit } from '../../../models/deposit'

export default async (req: Request, res: Response): Promise<void> => {
  const depositService = req.scope.resolve("depositService")
  // const manager: EntityManager = req.scope.resolve("manager")
  // const postRepo = manager.getRepository(Deposit)
  
  const data = {
    method: "Bank Transfer CON CAC 3",
    fiat_amount: 800000,
  };
  const id = "des_22222"
  // const result = await depositService.create(data)
  const result = await depositService.update(id, data)
  console.log("result: ", result)
  res.json({
    result: result,
    hello: "world"
  })
}
