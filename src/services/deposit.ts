import { Customer, FindConfig, Selector, TransactionBaseService, buildQuery } from "@medusajs/medusa"
import { DepositRepository } from "../repositories/deposit"
import { Deposit } from "../models/deposit"
import ProductService from "./product"
import { Lifetime } from "awilix"
import { User } from "../models/user"
import { MedusaError } from "@medusajs/utils"
import { FindOperator } from "typeorm"
import UserRepository from "@medusajs/medusa/dist/repositories/user"
import UserService from "./user"
declare class FilterableDepositProps {
  id?: string | string[];
  q?: string;
  user_id?: string[];
  customer_id?: string[];
  txn?: string[]
}

type DepositSelector = FilterableDepositProps | (Selector<Deposit> & {
  q?: string;
  txn?: string[] | FindOperator<Deposit>;
  user_id?: string[] | FindOperator<Deposit>;
  customer_id?: string[] | FindOperator<Deposit>;
});

type DepositSelector1 = {
  user_id?: string
  customer_id?: string
  txn?: string
}


class DepositService extends TransactionBaseService {
  // ...
  static LIFE_TIME = Lifetime.SCOPED

  protected depositRepository_: typeof DepositRepository
  private userService: UserService

  protected readonly loggedInUser_: User | null
  protected readonly loggedInCustomer_: Customer | null

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments)
    this.depositRepository_ = container.depositRepository
    this.userService = container.userService

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
    selector?: DepositSelector1,
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

  async list(
    selector?: DepositSelector1,
    config: FindConfig<Deposit> = {
      skip: 0,
      take: 20,
      relations: [],
    }): Promise<Deposit[]> {
    console.log("list::selector:", selector)
    console.log("list::config:", config)
    console.log("create():::depositRepo:::Login user: ", this?.loggedInUser_?.email, " Role: ", this?.loggedInUser_?.role)

    if (this?.loggedInUser_?.role === 'member') {
      const selector123: DepositSelector1 = {
        user_id: this?.loggedInUser_?.id
      };
      const [posts] = await this.listAndCount(selector123)
      return posts
    } else if (this?.loggedInUser_?.role === 'admin') {
      const selector123: DepositSelector1 = {
      };
      const [posts] = await this.listAndCount(selector123)
      return posts
    }

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
    data: Pick<Deposit, "method" | "fiat_amount" | "txn" | "note" | "typeTrans">
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

        deposit.typeTrans = data.typeTrans
        deposit.status = "Chờ Duyệt - Chưa chuyển khoản"
        deposit.revicedBankName = "MB"
        deposit.revicedBankNumber = "3889999999996"
        deposit.revicedName = "BUI XUAN HUNG"
        deposit.user_id = this?.loggedInUser_?.id

        const result = await depositRepo.save(deposit)

        return result
      }

    })
  }
  async createWithDraw(
    data: Pick<Deposit, "method" | "fiat_amount" | "txn" | "note" | "typeTrans" | "revicedBankName"
      | "revicedBankNumber" | "revicedName">
  ): Promise<Deposit> {
    return this.atomicPhase_(async (manager) => {
      const depositRepo = this.activeManager_.withRepository(
        this.depositRepository_
      )
      const deposit = depositRepo.create()
      const user = await this.userService.retrieve(this?.loggedInUser_?.id)
    

      console.log("create():::depositRepo:::Login user: ", this?.loggedInUser_?.email, " Role: ", this?.loggedInUser_?.role)
      console.log("create():::depositRepo:::Login customer: ", this?.loggedInCustomer_?.email, " Role: ", this?.loggedInCustomer_?.has_account)

      if (this?.loggedInUser_?.role === "member") {
        console.log("user: ", user)
      
        if (user.coin <= data.fiat_amount) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "Số tiền không đủ"
          )
        }
        deposit.coin_amount = data.fiat_amount
        deposit.method = data.method
        deposit.fiat_amount = data.fiat_amount
        deposit.fiat_type = "VND"
        deposit.txn = data.txn
        deposit.note = data.note

        deposit.typeTrans = data.typeTrans
        deposit.status = "Chờ Duyệt"

        deposit.revicedBankName = data.revicedBankName
        deposit.revicedBankNumber = data.revicedBankNumber
        deposit.revicedName = data.revicedName

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
