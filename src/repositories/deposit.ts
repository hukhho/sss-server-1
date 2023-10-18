import { Deposit } from "../models/deposit"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const DepositRepository = dataSource
  .getRepository(Deposit)
  .extend({
    customMethod(): void {
      return
    },
  })

export default DepositRepository