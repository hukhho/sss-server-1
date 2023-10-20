import { Request, Response } from 'express'
import { EntityManager } from 'typeorm'
import { Deposit } from '../../../models/deposit'
import { CreateUserInput as MedusaCreateUserInput } from "@medusajs/medusa/dist/types/user"

type CreateUserInput = {
  email: string
  password: string
} & MedusaCreateUserInput

export default async (req: Request, res: Response): Promise<void> => {
  const userService = req.scope.resolve("userService")

  const dataBody = req.body as CreateUserInput | undefined

  // const data = {
  //   email: "hacker002@gmail.com",
  //   password: "hacker002@gmail.com",
  //   first_name: "hacker001",
  //   last_name: "hacker001",
  //   phone: "123456789",
  //   country_code: "VN",
  //   metadata: {
  //     test: "test"
  //   }
  // };
  const result = await userService.create(dataBody, dataBody.password).catch((err) => {
    return res.json({ error: err }).status(500)
  })

  res.json({
    result: result
  })
}
