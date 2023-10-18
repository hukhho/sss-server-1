import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm"
import { BaseEntity, Customer } from "@medusajs/medusa"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { User } from "./user";

@Entity()
export class Deposit extends BaseEntity {
    @Index("DepositUserId")
    @Column({ nullable: true })
    user_id?: string;

    @Index("DepositCustomerId")
    @Column({ nullable: true })
    customer_id?: string;

    @ManyToOne(() => User, (user) => user.deposits)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user?: User;

    @ManyToOne(() => Customer, (cus) => cus.deposits)
    @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
    customer?: Customer;

    @Column({ type: "numeric", precision: 20, scale: 2, default: 0 })
    coin_amount: number;

    @Column({ type: "varchar", default: 10 })
    fiat_type: string;

    @Column({ type: "numeric", precision: 20, scale: 2, default: 0 })
    fiat_amount: number;

    @Column({ type: "varchar", length: 255 })
    method: string;

    @Column({ type: "varchar", length: 255 })
    status: string;

    @CreateDateColumn() // This adds the created_at column
    created_at: Date;

    @CreateDateColumn() // This adds the updated_at column
    updated_at: Date;

    @Column({ type: "text", nullable: true })
    note: string;
    
    @Column({ type: "text", nullable: true })
    txn: string;

    @Column({ type: "text", nullable: true })
    typeTrans: string;
    @Column({ type: "text", nullable: true })
    revicedName: string;
    @Column({ type: "text", nullable: true })
    revicedBankName: string;
    @Column({ type: "text", nullable: true })
    revicedBankNumber: string;
    
    
    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "deposit")
    }
}
