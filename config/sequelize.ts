import { Sequelize } from "sequelize-typescript";

import { User, Blog, Token } from "../models";

const POSTGRES_URI: string = process.env.DATABASE_URI!;

export const sequelize = new Sequelize(POSTGRES_URI, {
  dialect: "postgres",
  host: 'localhost',
  models: [User, Blog, Token]
});