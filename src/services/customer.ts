import { Lifetime } from "awilix"
import { Customer, FindConfig, CustomerService as MedusaCustomerService } from "@medusajs/medusa"
import { User } from "../models/user"
import { CreateCustomerInput as MedusaCreateCustomerInput } from "@medusajs/medusa/dist/types/customers"
import StoreRepository from "@medusajs/medusa/dist/repositories/store"

type CreateCustomerInput = {

} & MedusaCreateCustomerInput

class CustomerService extends MedusaCustomerService {
    static LIFE_TIME = Lifetime.SCOPED
    protected readonly loggedInCustomer_: Customer | null


    constructor(container, options) {
        // @ts-expect-error prefer-rest-params
        super(...arguments)

        try {
            this.loggedInCustomer_ = container.loggedInCustomer
        } catch (e) {
            // avoid errors when backend first runs
        }
    }

 
    async retrieve(customerId: string, config?: FindConfig<Customer>): Promise<Customer> {

        // config.relations = [
        //     ...(config.relations || []),
        // ]

        const customer = await super.retrieve(customerId, config);

        console.log("retrieve customer: ", customer)

        // if (product.store?.id && this.loggedInUser_?.store_id && product.store.id !== this.loggedInUser_.store_id) {
        //   // Throw error if you don't want a product to be accessible to other stores
        //   throw new Error('Product does not exist in store.');
        // }

        return customer
    }



}

export default CustomerService