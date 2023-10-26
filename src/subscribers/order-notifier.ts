import { ProductService, OrderService } from "@medusajs/medusa"
import UserService from "../services/user"
class OrderNotifierSubscriber {
  protected readonly productService: ProductService
  protected readonly orderService: OrderService
  protected readonly userService: UserService

  constructor({ productService, orderService, userService, eventBusService }) {

    this.productService = productService
    this.orderService = orderService
    this.userService = userService

    eventBusService.subscribe("order.shipment_created", this.handleOrder)

  }

  handleOrder = async (data) => {

    console.log("Shipped Order: ", data)
    const order = await this.orderService.retrieve(data.id, { relations: ["items", "items.variant", "items.variant.product"] })
    console.log("Shipped Order: order", order)
    console.log("Shipped Order: order.items", order.items)
    order.items.forEach(async (item) => {
      console.log("Shipped Order: item", item)
      const sellerId = item.variant.product.seller_id;
      console.log("sellerId: ", sellerId)

      const user = await this.userService.retrieve(sellerId)
      // Assuming user.coin is a string
      const currentCoin: number = user.coin;
      const itemPrice: number = item.unit_price;
      console.log("currentCoin: ", currentCoin)
      console.log("itemPrice: ", itemPrice)

      // Use parseFloat to convert the currentCoin string to a number
      const newCoin: number = Number(currentCoin) + Number(itemPrice);

      console.log("newCoin: ", newCoin)

      console.log(newCoin);


      const coin = await this.userService.update(sellerId, { coin: newCoin })
      console.log("coin: ", coin)
    })



  }
}

export default OrderNotifierSubscriber