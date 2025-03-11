import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Tenant } from "../../tenants/entities/tenant.entity";
import { User } from "../../users/entities/user.entity";
import { OrderItem } from "./order-item.entity";
import { OrderStatus } from "@supply-chain-system/shared";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  orderNumber: string;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.DRAFT,
  })
  status: OrderStatus;

  @Column({ type: "date" })
  orderDate: Date;

  @Column({ type: "date", nullable: true })
  expectedDeliveryDate: Date;

  @Column({ type: "date", nullable: true })
  actualDeliveryDate: Date;

  @Column({ nullable: true })
  shippingAddress: string;

  @Column({ nullable: true })
  billingAddress: string;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  shippingCost: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ nullable: true })
  notes: string;

  @Column("uuid")
  tenantId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: "tenantId" })
  tenant: Tenant;

  @Column("uuid")
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  paymentStatus: string;

  @Column({ nullable: true })
  trackingNumber: string;

  @Column({ nullable: true })
  supplierOrderReference: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
