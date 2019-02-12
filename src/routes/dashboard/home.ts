import * as express from "express";

import asyncWrapper from "../../util/asyncWrapper";
import { AuthorizationType } from "../../middleware/authentication";

const router = express.Router();

router.get("/", asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (req.user.authorizationType !== AuthorizationType.Dashboard) {
		return res.redirect("/dash/login");
	}

	res.render("pages/home");
}));

export default router;
