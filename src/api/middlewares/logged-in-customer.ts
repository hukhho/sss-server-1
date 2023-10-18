import { CustomerService } from "@medusajs/medusa"
import { Customer } from "@medusajs/medusa"

export async function registerLoggedInCustomer(req, res, next) {
  let loggedInCustomer: Customer | null = null
  console.log('req.session: ', req)

  if (req.session.customer_id) {
    console.log('loggedInCustomer:req.session.customer_id ', req.session.customer_id)

    const customerService = 
      req.scope.resolve("customerService") as CustomerService
    loggedInCustomer = await customerService.retrieve(req.session.customer_id)
  }

  req.scope.register({
    loggedInCustomer: {
      resolve: () => loggedInCustomer,
     },
   })
  console.log('loggedInCustomer: ', loggedInCustomer)
  next()
}