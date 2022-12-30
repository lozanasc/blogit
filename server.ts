
import { config } from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import chalk from 'chalk';

config();

import { 
  authRouter,
  userRouter,
  blogRouter,
  errorRouter
} from "./routes";

import { sequelize } from "./config/sequelize";

const PORT: number = Number(process.env.PORT) || 8000;

const api: Application = express();

api.use(cors());
api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.use(cookieParser());
api.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

api.use([
  authRouter,
  userRouter,
  blogRouter,
  errorRouter,
]);

sequelize.sync()
.then(() => {
  api.listen(
    PORT, 
    () => console.log(`API is listening at PORT=${PORT} \nLocal: ${chalk.cyan(`http://localhost:${PORT}`)}`));
})
.catch((err: any) => {
  throw err;
});
