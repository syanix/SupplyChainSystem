import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Supplier } from "./supplier.entity";

@Entity("supplier_contacts")
export class SupplierContact {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: true })
  isPrimary: boolean;

  @Column("uuid")
  supplierId: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.contacts, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "supplierId" })
  supplier: Supplier;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
