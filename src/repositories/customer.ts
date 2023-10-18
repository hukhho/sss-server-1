import { Customer } from "@medusajs/medusa"
import { User } from "../models/user"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"
import {
  CustomerRepository as MedusaCustomerRepository,
} from "@medusajs/medusa/dist/repositories/customer"
import { DeepPartial } from "typeorm"

export const CustomerRepository = dataSource
  .getRepository(Customer)
  .extend({
    ...Object.assign(
      MedusaCustomerRepository, 
      { target: Customer }
    ),
  })

export default CustomerRepository