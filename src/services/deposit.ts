import { Customer, FindConfig, Selector, TransactionBaseService, buildQuery } from "@medusajs/medusa"
import { DepositRepository } from "../repositories/deposit"
import { Deposit } from "../models/deposit"
import ProductService from "./product"
import { Lifetime } from "awilix"
import { User } from "../models/user"
import { MedusaError } from "@medusajs/utils"


type DepositSelector = {
  user_id?: string
  customer_id?: string
}


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
  async listAndCount(
    selector?: Selector<Deposit>,
    config: FindConfig<Deposit> = {
      skip: 0,
      take: 20,
      relations: [],
    }): Promise<[Deposit[], number]> {
    const depositRepo = this.activeManager_.withRepository(
      this.depositRepository_
    )

    const query = buildQuery(selector, config)

    return depositRepo.findAndCount(query)
  }

  async list(selector?: Selector<Deposit>,
    config: FindConfig<Deposit> = {
      skip: 0,
      take: 20,
      relations: [],
    }): Promise<Deposit[]> {

    const depositRepo = this.activeManager_.withRepository(
      this.depositRepository_
    )
    console.log("list():::depositRepo:::Login user: ", " id: ", this.loggedInUser_.id, " ", this?.loggedInUser_?.email, " Role: ", this?.loggedInUser_?.role)
    console.log("list():::depositRepo:::Login customer: ", this?.loggedInCustomer_?.email, " Role: ", this?.loggedInCustomer_?.has_account)
    // try {
    //   if (this?.loggedInUser_?.role === "member") {
    //     selector.user_id = this.loggedInUser_.id
    //   } else if (this?.loggedInCustomer_?.has_account === true) {
    //     selector.customer_id = this.loggedInCustomer_.id
    //   }
    // } catch (e) {
    //   // avoid errors when backend first runs
    //   console.log("error: ", e)
    // }
    const [deposits] = await this.listAndCount(selector, config)

    return deposits
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
    data: Pick<Deposit, "method" | "fiat_amount" | "txn" | "note">
  ): Promise<Deposit> {
    return this.atomicPhase_(async (manager) => {
      const depositRepo = this.activeManager_.withRepository(
        this.depositRepository_
      )
      const deposit = depositRepo.create()

      console.log("create():::depositRepo:::Login user: ", this?.loggedInUser_?.email, " Role: ", this?.loggedInUser_?.role)
      console.log("create():::depositRepo:::Login customer: ", this?.loggedInCustomer_?.email, " Role: ", this?.loggedInCustomer_?.has_account)

      if (this?.loggedInUser_?.role === "member") {
        deposit.coin_amount = data.fiat_amount
        deposit.method = data.method
        deposit.fiat_amount = data.fiat_amount
        deposit.fiat_type = "VND"
        deposit.txn = data.txn
        deposit.note = data.note

        deposit.typeTrans = "DEPOSIT"
        deposit.status = "PENDING"
        deposit.revicedBankName = "MB"
        deposit.revicedBankNumber = "3889999999996"
        deposit.revicedName = "BUI XUAN HUNG"
        deposit.user_id = this?.loggedInUser_?.id

        const result = await depositRepo.save(deposit)

        return result
      }

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
