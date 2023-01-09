import { Router } from "express";

import { login, refreshToken, signout, signup } from "../controllers";

import { validateLogin, validateSignup } from "../middlewares";

const authRouter: Router = Router();

authRouter.post("/login", validateLogin, login);
authRouter.post("/signup", validateSignup, signup);
authRouter.get("/signout", signout);
authRouter.get("/refresh", refreshToken);

export default authRouter;