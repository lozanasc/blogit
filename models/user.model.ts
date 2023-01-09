import { UUIDV4 } from "sequelize";
import { 
  Table, 
  Model, 
  Column, 
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
  HasOne,
  Unique,
  Default
} from "sequelize-typescript";

import { Blog } from "./blogs.model";
import { Token } from "./token.model";

@Table
export class User extends Model {
  
  @PrimaryKey 
  @Default(UUIDV4) 
  @Column
  id!: string;

  @Unique 
  @Column
  username!: string;

  @Column
  password!: string;

  @Column
  first_name!: string;

  @Column
  last_name!: string;

  @Unique 
  @Column
  email!: string;

  @Column
  profile_picture_url!: string;

  @CreatedAt 
  @Column
  created_at?: Date;

  @UpdatedAt 
  @Column
  updated_at?: Date;

  @DeletedAt 
  @Column
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