import { config } from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import chalk from "chalk";
import multer from "multer";
import path from "path";

config();

import { 
  authRouter,
  userRouter,
  blogRouter,
  errorRouter
} from "./routes";


import { fileStorage, sequelize } from "./config";
import { fileFilter, options } from "./utils";

const PORT: number = Number(process.env.PORT) || 8000;

const api: Application = express();

const corsOptions = process.env.APP_ENV !== "dev" ? options : {};

api.use(multer({ storage: fileStorage, fileFilter }).single("image"));
api.use(cors(corsOptions));
api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.use(cookieParser());
api.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

api.use('/storage', express.static(path.join(__dirname, 'storage')));
api.use('/static', express.static(path.join(__dirname, 'public')));

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
