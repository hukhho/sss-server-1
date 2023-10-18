import { Customer, FindConfig, TransactionBaseService, buildQuery } from "@medusajs/medusa"
import { DepositRepository } from "../repositories/deposit"
import { Deposit } from "../models/deposit"
import ProductService from "./product"
import { Lifetime } from "awilix"
import { User } from "../models/user"
import { MedusaError } from "@medusajs/utils"

class DepositService extends TransactionBaseService {
  // ...
  static LIFE_TIME = Lifetime.SCOPED

  protected depositRepository_: typeof DepositRepository
  protected readonly loggedInUser_: User | null
  protected readonly loggedInCustomer_: Customer | null

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments)
    this.depositRepository_ = container.depositRepository
    try {
      this.loggedInUser_ = container.loggedInUser
    } catch (e) {
      // avoid errors when backend first runs
    }
    try {
      this.loggedInCustomer_ = container.loggedInCustomer
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  getMessage() {
    return `Con cac hihi!`
  }

  async list(): Promise<Deposit[]> {
    const depositRepo = this.activeManager_.withRepository(
      this.depositRepository_
    )
    console.log("list():::depositRepo:::Login user: ", this?.loggedInUser_?.email, " Role: ", this?.loggedInUser_?.role)
    console.log("list():::depositRepo:::Login customer: ", this?.loggedInCustomer_?.email, " Role: ", this?.loggedInCustomer_?.has_account)

    return await depositRepo.find()
  }

  async retrieve(
    id: string,
    config?: FindConfig<Deposit>
  ): Promise<Deposit> {
    const depositRepo = this.activeManager_.withRepository(
      this.depositRepository_
    )

    const query = buildQuery({
      id,
    }, config)

    const post = await depositRepo.findOne(query)

    if (!post) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Deposit was not found"
      )
    }

    return post
  }


  async create(
    data: Pick<Deposit, "id" | "method" | "fiat_amount" | "txn" | "note">
  ): Promise<Deposit> {
    return this.atomicPhase_(async (manager) => {
      const depositRepo = this.activeManager_.withRepository(
        this.depositRepository_
      )
      const deposit = depositRepo.create()
      console.log("data: ", data)
      deposit.id = data.id
      deposit.coin_amount = data.fiat_amount
      deposit.method = data.method
      deposit.fiat_amount = data.fiat_amount
      deposit.txn = data.txn
      deposit.note = data.note
      deposit.typeTrans = "DEPOSIT"
      deposit.status = "PENDING"
      deposit.revicedBankName = "MB"
      deposit.revicedBankNumber = "3889999999996"
      deposit.revicedName = "BUI XUAN HUNG"
      console.log("deposit: ", deposit)

      const result = await depositRepo.save(deposit)

      return result
    })
  }

  async update(
    id: string,
    data: Omit<Partial<Deposit>, "id">
  ): Promise<Deposit> {
    return await this.atomicPhase_(async (manager) => {
      const depositRepo = manager.withRepository(
        this.depositRepository_
      )
        
      const deposit = await this.retrieve(id)


      Object.assign(deposit, data)

      return await depositRepo.save(deposit)
    })
  }




}
export default DepositService
