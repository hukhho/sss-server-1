import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import {
    Customer as MedusaCustomer,
} from "@medusajs/medusa"
import { Product } from "./product";
import { Deposit } from "./deposit";

@Entity()
export class Customer extends MedusaCustomer {

    @Column({ type: "numeric", precision: 20, scale: 2, default: 0 })
    coin?: number;

    @OneToMany(() => Deposit, (deposit) => deposit?.customer)
    deposits?: Deposit[];

}