import { Router } from "express";

import { login } from "../controllers";

import { validateLogin } from "../middlewares";

const authRouter: Router = Router();

authRouter.post('/login', validateLogin, login);

export default authRouter;