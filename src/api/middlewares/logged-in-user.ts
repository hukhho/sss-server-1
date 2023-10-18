import { UserService } from "@medusajs/medusa"
import { User } from "../../models/user"

export async function registerLoggedInUser(req, res, next) {
  let loggedInUser: User | null = null
  console.log('registerLoggedInUser req: ', req)

  if (req.user && req.user.userId) {
    console.log('registerLoggedInUser userid: ', req.user.userId)

    const userService = 
      req.scope.resolve("userService") as UserService
    loggedInUser = await userService.retrieve(req.user.userId)
  }

  req.scope.register({
    loggedInUser: {
      resolve: () => loggedInUser,
     },
   })
  console.log('registerLoggedInUser')
  next()
}