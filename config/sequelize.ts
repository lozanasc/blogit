import { Sequelize } from "sequelize-typescript";

import { User, Blog, Token } from "../models";

const ENV: string = process.env.APP_ENV!;

let POSTGRES_URI: string = (ENV === "dev" ? process.env.DATABASE_URI! : process.env.PROD_DATABASE_URI!);

export const sequelize = new Sequelize(POSTGRES_URI, {
  dialect: "postgres",
  host: "localhost",
  models: [User, Blog, Token],
});