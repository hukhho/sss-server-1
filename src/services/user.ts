import { Lifetime } from "awilix"
import { FindConfig, UserService as MedusaUserService } from "@medusajs/medusa"
import { User } from "../models/user"
import { CreateUserInput as MedusaCreateUserInput,
    UpdateUserInput as MedusaUpdateUserInput } from "@medusajs/medusa/dist/types/user"
import StoreRepository from "@medusajs/medusa/dist/repositories/store"

type CreateUserInput = {
    coin?: number
} & MedusaCreateUserInput

type UpdateUserCoin = {
    coin?: number
}  & MedusaUpdateUserInput
 
type UserCoinRespose = {
    coin?: number
} & User

class UserService extends MedusaUserService {
    static LIFE_TIME = Lifetime.SCOPED
    protected readonly loggedInUser_: User | null
    protected readonly storeRepository_: typeof StoreRepository;

    constructor(container, options) {
        // @ts-expect-error prefer-rest-params
        super(...arguments)
        this.storeRepository_ = container.storeRepository

        try {
            this.loggedInUser_ = container.loggedInUser
        } catch (e) {
            // avoid errors when backend first runs
        }
    }
    async retrieve(userId: string, config?: FindConfig<User>): Promise<User> {
        // config.relations = [
        //   ...(config.relations || []),
        // ]
    
        const user = await super.retrieve(userId, config);
        
    
        return user
      }

      
    async create(user: CreateUserInput, password: string): Promise<User> {
        user.first_name = "ews_12345"
        user.coin = 0
        user.metadata = { hello: "world" }
        return await super.create(user, password)
    }

    async update(userId: string, user: UpdateUserCoin): Promise<User> {
        // const userGet = await this.retrieve(userId);
        const user1 = await this.retrieve(userId);
        // console.log("retrieve user: ", user)     
        return await super.update(userId, user1)
        // if (product.store?.id && this.loggedInUser_?.store_id && product.store.id !== this.loggedInUser_.store_id) {
        //   // Throw error if you don't want a product to be accessible to other stores
        //   throw new Error('Product does not exist in store.');
        // }
    }



}

export default UserService