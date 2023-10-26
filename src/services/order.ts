import { Lifetime } from "awilix"
import {
  FindConfig,
  OrderService as MedusaOrderService, Order, Selector, User,
} from "@medusajs/medusa"
import { AdminListOrdersSelector as MedusaOrderSelector } from "@medusajs/medusa/dist/types/orders"
import UserRepository from "@medusajs/medusa/dist/repositories/user"

type Product = {
  id: string
  seller_id: string
}
type LineItemSelector = {
  varriant: Product
}

type OrderSelector = {
  items: LineItemSelector[]
} & Selector<Order>

class OrderService extends MedusaOrderService {
  static LIFE_TIME = Lifetime.SCOPED
  protected readonly loggedInUser_: User | null
  protected readonly userRepository_: typeof UserRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments)
    this.userRepository_ = container.userRepository

    try {
      this.loggedInUser_ = container.loggedInUser
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async list(selector: OrderSelector, config?: FindConfig<Order>): Promise<Order[]> {
    // if (!selector.store_id && this.loggedInUser_?.store_id) {
    //   selector.store_id = this.loggedInUser_.store_id
    // }

    // config.select?.push('store_id')

    // config.relations?.push('store')
    console.log("OrderService:::list:selector", selector)
    const orderList = await super.list(selector, config)

    if (this?.loggedInUser_?.role != 'admin' && this?.loggedInUser_?.id) {
      // selector.seller_id = this.loggedInUser_.id
      // config.select?.push('seller_id')
      // config.relations?.push('user')
    }

    return orderList
  }

  async listAndCount(selector: OrderSelector, config?: FindConfig<Order>): Promise<[Order[], number]> {
    // if (!selector.store_id && this.loggedInUser_?.store_id) {
    //   selector.store_id = this.loggedInUser_.store_id
    // }

    // config.select?.push('store_id')
    //{ relations: ["items", "items.variant"] }

    config.relations?.push('items', 'items.variant')

    // console.log("OrderService:::listAndCount:orderList", orderList)



    //   // Now, you can safely iterate through the items in the selector
    //   for (const item of selector.items) {
    //     if (item.varriant) {
    //       // Update the seller_id property of the variant
    //       item.varriant.seller_id = this.loggedInUser_.id;
    //     }
    //   }
    // }
    if (this?.loggedInUser_?.role != 'admin' && this?.loggedInUser_?.id) {
      const orderSuper = await super.listAndCount(selector, config);
      const orderList = orderSuper[0];
      const number = orderSuper[1];
      const filterOrder = orderList.filter(order => {
        if (order.items === null || order.items === undefined) {
          return false; // Exclude orders with null or undefined items
        }
        // Use the some() method to check if any item matches the condition
        const hasMatchingItem = order.items.some(item => {
          return item.variant && item.variant.product.seller_id === this?.loggedInUser_?.id;
        });

        return hasMatchingItem;
      });

      console.log("OrderService:::listAndCount:orderList", orderList);
      // config.relations?.push('user');

      return [filterOrder, number]
    } else {
      return await super.listAndCount(selector, config);
    }
  }

  // async retrieve(productId: string, config?: FindOrderConfig): Promise<Order> {
  //   config.relations = [
  //     ...(config.relations || []),
  //   ]

  //   const product = await super.retrieve(productId, config);

  //   console.log("Login user: ", this?.loggedInUser_?.email," Role: ", this?.loggedInUser_?.role)

  //   // if (product.store?.id && this.loggedInUser_?.store_id && product.store.id !== this.loggedInUser_.store_id) {
  //   //   // Throw error if you don't want a product to be accessible to other stores
  //   //   throw new Error('Order does not exist in store.');
  //   // }

  //   return product
  // }

  // async create(productObject: CreateOrderInput): Promise<Order> {
  //   // if (!productObject.store_id && this.loggedInUser_?.store_id) {
  //   //   productObject.store_id = this.loggedInUser_.store_id
  //   // }
  //   //author: Hung 2k9 Vip Vai Ca Lon
  //   //Code nhu con cac dit me may :))) Nhin cai deo gi :)) Tao noi may do thang mat lon 

  //   console.log("Login user: ", this?.loggedInUser_?.email," Role: ", this?.loggedInUser_?.role, "Order: productObject: ", productObject)
  //   console.log("create:::productObject: ", productObject)

  //   if (this?.loggedInUser_?.role != 'admin' && this?.loggedInUser_?.id) {
  //     console.log("create:::product:::member:::productObject: ", productObject)

  //     productObject.metadata = {
  //       "tennganhang": "MBBANK",
  //       "tenchutaikhoan": "Nguyen Van A",
  //       "sotaikhoan": "3889999999996"
  //     }
  //     productObject.seller_id = this.loggedInUser_.id


  //   }


  //   return await super.create(productObject);
  // }
}

export default OrderService