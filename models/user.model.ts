import { 
  Table, 
  Model, 
  Column, 
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
  HasOne
} from "sequelize-typescript";

import { Blog } from "./blogs.model";
import { Token } from "./token.model";

// 👤 User Schema
// id (pk)
// username
// password
// first_name
// last_name
// email
// profile_picture_url
// created_at
// updated_at
// deleted_at
// password_chances
// role

@Table
export class User extends Model {
  
  @PrimaryKey @Column
  id!: string;

  @Column
  username!: string;

  @Column
  password!: string;

  @Column
  first_name!: string;

  @Column
  last_name!: string;

  @Column
  email!: string;

  @Column
  profile_picture_url!: string;

  @CreatedAt @Column
  created_at!: Date;

  @UpdatedAt @Column
  updated_at!: Date;

  @DeletedAt @Column
  deleted_at?: Date;
  
  @Column
  password_chances!: number;

  @Column
  role!: string;

  @HasMany(() => Blog)
  blogs?: Blog[];

  @HasOne(() => Token)
  token?: Token;
  
}