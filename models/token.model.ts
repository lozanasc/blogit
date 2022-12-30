import { 
  Table, 
  Model, 
  Column, 
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  AllowNull,
  BelongsTo
} from "sequelize-typescript";
import { User } from "./user.model";

@Table
export class Token extends Model {

  @PrimaryKey
  @Column
  id!: string;

  @ForeignKey(() => User)
  @Column
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @CreatedAt @Column
  created_at!: Date;

  @UpdatedAt @Column
  updated_at?: Date;

  @DeletedAt @AllowNull @Column
  deleted_at?: Date;

  @Column
  refreshToken?: string;
  
}