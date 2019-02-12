import * as express from "express";

import asyncWrapper from "../../util/asyncWrapper";
import requireAuth from "../../middleware/requireAuth";

import { AuthorizationType } from "../../middleware/authentication";

const router = express.Router();

router.post("/",
	requireAuth(AuthorizationType.Dashboard),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	res.clearCookie("dashboard-token")
	.send();
}));

export default router;
