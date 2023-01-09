import { UUIDV4 } from "sequelize";
import { 
  Table, 
  Model, 
  Column, 
  PrimaryKey,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsTo,
  AllowNull,
  Default,
  IsUrl,
  DataType,
} from "sequelize-typescript";

import { User } from "./user.model";

@Table
export class Blog extends Model {
  
  @PrimaryKey
  @Default(UUIDV4)
  @Column
  id!: string;

  @Column
  title!: string;

  @Column(DataType.TEXT("long"))
  description!: string;

  @Column
  cover_picture_url!: string;

  @ForeignKey(() => User) 
  @Column
  userId!: string;

  @BelongsTo(() => User)
  user!: User

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;

  @DeletedAt
  @AllowNull
  @Column
  deleted_at?: Date;

  @Default(true)
  @Column
  is_draft!: boolean;

  @Default(0)
  @Column
  views?: number;

} 