import { UUIDV4 } from "sequelize";
import { 
  Table, 
  Model, 
  Column, 
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  Default,
  AllowNull
} from "sequelize-typescript";
import { User } from "./user.model";

@Table
export class Token extends Model {

  @PrimaryKey 
  @Default(UUIDV4) 
  @Column
  id!: string;

  @ForeignKey(() => User)
  @Column
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @CreatedAt 
  @Column
  created_at?: Date;

  @UpdatedAt 
  @Column
  updated_at?: Date;

  @DeletedAt 
  @Column
  deleted_at?: Date;

  @AllowNull 
  @Column
  refresh_token?: string;
  
}