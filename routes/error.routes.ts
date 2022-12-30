import { Router } from "express";

import { notFound } from "../controllers";

const errorRouter: Router = Router();

errorRouter.use(notFound);

export default errorRouter;
