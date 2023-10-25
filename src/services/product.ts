import { Lifetime } from "awilix"
import { 
  ProductService as MedusaProductService, Product, User,
} from "@medusajs/medusa"
import { CreateProductInput as MedusaCreateProductInput, FindProductConfig, ProductSelector as MedusaProductSelector } from "@medusajs/medusa/dist/types/product"

type ProductSelector = {
  store_id?: string
} & MedusaProductSelector

type ProductSelector1 = {
  seller_id?: string
} & MedusaProductSelector

type CreateProductInput = {
  seller_id?: string
} & MedusaCreateProductInput

class ProductService extends MedusaProductService {
  static LIFE_TIME = Lifetime.SCOPED
  protected readonly loggedInUser_: User | null

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments)

    try {
      this.loggedInUser_ = container.loggedInUser
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async list(selector: ProductSelector1, config?: FindProductConfig): Promise<Product[]> {
    // if (!selector.store_id && this.loggedInUser_?.store_id) {
    //   selector.store_id = this.loggedInUser_.store_id
    // }

    // config.select?.push('store_id')

    // config.relations?.push('store')
    console.log("ProductService:::list:selector", selector)

    if (this?.loggedInUser_?.role != 'admin' && this?.loggedInUser_?.id) {
      selector.seller_id = this.loggedInUser_.id
      config.select?.push('seller_id')
    }
    config.relations?.push('user')


    return await super.list(selector, config)
  }

  async listAndCount(selector: ProductSelector1, config?: FindProductConfig): Promise<[Product[], number]> {
    // if (!selector.store_id && this.loggedInUser_?.store_id) {
    //   selector.store_id = this.loggedInUser_.store_id
    // }

    // config.select?.push('store_id')
    // config.relations?.push('store')
    console.log("ProductService:::listAndCount:Selector", selector)
    if (this?.loggedInUser_?.role != 'admin' && this?.loggedInUser_?.id) {
      selector.seller_id = this.loggedInUser_.id
      config.select?.push('seller_id')
    }
    config.relations?.push('user')


    return await super.listAndCount(selector, config)
  }

  async retrieve(productId: string, config?: FindProductConfig): Promise<Product> {
    config.relations = [
      ...(config.relations || []),
    ]

    const product = await super.retrieve(productId, config);

    console.log("Login user: ", this?.loggedInUser_?.email," Role: ", this?.loggedInUser_?.role)

    // if (product.store?.id && this.loggedInUser_?.store_id && product.store.id !== this.loggedInUser_.store_id) {
    //   // Throw error if you don't want a product to be accessible to other stores
    //   throw new Error('Product does not exist in store.');
    // }

    return product
  }

  async create(productObject: CreateProductInput): Promise<Product> {
    // if (!productObject.store_id && this.loggedInUser_?.store_id) {
    //   productObject.store_id = this.loggedInUser_.store_id
    // }
    //author: Hung 2k9 Vip Vai Ca Lon
    //Code nhu con cac dit me may :))) Nhin cai deo gi :)) Tao noi may do thang mat lon 

    console.log("Login user: ", this?.loggedInUser_?.email," Role: ", this?.loggedInUser_?.role, "Product: productObject: ", productObject)
    console.log("create:::productObject: ", productObject)

    if (this?.loggedInUser_?.role != 'admin' && this?.loggedInUser_?.id) {
      console.log("create:::product:::member:::productObject: ", productObject)

      productObject.metadata = {
        "tennganhang": "MBBANK",
        "tenchutaikhoan": "Nguyen Van A",
        "sotaikhoan": "3889999999996"
      }
      productObject.seller_id = this.loggedInUser_.id
      

    }
    

    return await super.create(productObject);
  }
}

export default ProductService