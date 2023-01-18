import { Router } from "express";

import { getFileFromStorage } from "../controllers";

const storageRouter: Router = Router();

storageRouter.get("/storage/:key", getFileFromStorage);

export default storageRouter;