import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { Tenant } from "../../tenants/entities/tenant.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: ["ADMIN", "MANAGER", "STAFF"],
    default: "STAFF",
  })
  role: string;

  @Column("uuid")
  tenantId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: "tenantId" })
  tenant: Tenant;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper methods
  get firstName(): string {
    return this.name.split(" ")[0];
  }

  get lastName(): string {
    const nameParts = this.name.split(" ");
    return nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
  }

  get fullName(): string {
    return this.name;
  }

  get roles(): string[] {
    return [this.role.toLowerCase()];
  }
}
