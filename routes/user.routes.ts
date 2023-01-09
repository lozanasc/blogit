import { Router } from "express";
import { getProfile, updateProfile } from "../controllers";
import { validateProfileUpdate, verifyJwt, verifyRole } from "../middlewares";


const userRouter: Router = Router();

userRouter.get('/profile', [verifyJwt, verifyRole("USER")], getProfile);

userRouter.patch('/profile', validateProfileUpdate, [verifyJwt, verifyRole("USER")], updateProfile);

export default userRouter;