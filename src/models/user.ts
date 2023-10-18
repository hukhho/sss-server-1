import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import {
  User as MedusaUser,
} from "@medusajs/medusa"
import { Product } from "./product";
import { Deposit } from "./deposit";

@Entity()
export class User extends MedusaUser {

  @Column({ type: "numeric", precision: 20, scale: 2, default: 0 })
  coin?: number;

  @OneToMany(() => Product, (product) => product?.user)
  products?: Product[];

  @OneToMany(() => Deposit, (deposit) => deposit?.user)
  deposits?: Deposit[];
}