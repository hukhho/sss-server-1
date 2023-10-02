import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm"
import {
  Product as MedusaProduct,
} from "@medusajs/medusa"
import { User } from "./user";

@Entity()
export class Product extends MedusaProduct {
  @Index("ProductSellerId")
  @Column({ nullable: true })
  seller_id?: string;

  @ManyToOne(() => User, (seller) => seller.products)
  @JoinColumn({ name: 'seller_id', referencedColumnName: 'id' })
  user?: User;
}