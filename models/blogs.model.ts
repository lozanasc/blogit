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
  AllowNull
} from "sequelize-typescript";

import { User } from "./user.model";

// 📓 Blog Scheme
// id (pk)
// title
// description
// cover_picture_url
// user_id
// created_at
// updated_at
// deleted_at
// is_draft

@Table
export class Blog extends Model {
  
  @PrimaryKey @Column
  id!: string;

  @Column
  title!: string;

  @Column
  description!: string;

  @Column
  cover_picture_url!: string;

  @ForeignKey(() => User) @Column
  userId!: string;

  @BelongsTo(() => User)
  user!: User

  @CreatedAt @Column
  created_at!: Date;

  @UpdatedAt @Column
  updated_at!: Date;

  @DeletedAt @AllowNull @Column
  deleted_at?: Date;

  @Column
  is_draft!: boolean;

}