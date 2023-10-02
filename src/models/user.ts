import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import {
  User as MedusaUser,
} from "@medusajs/medusa"
import { Product } from "./product";

@Entity()
export class User extends MedusaUser {
  @OneToMany(() => Product, (product) => product?.user)
  products?: Product[];  
}