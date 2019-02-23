import * as express from "express";

import { AuthorizationType } from "../../../middleware/authentication";

import requireAuth from "../../../middleware/requireAuth";
import asyncWrapper from "../../../util/asyncWrapper";

const router = express.Router();

router.post("/",
	requireAuth(AuthorizationType.Device),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {

}));

export default router;
