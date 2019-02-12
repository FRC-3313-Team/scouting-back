import * as express from "express";

import { AuthorizationType } from "../middleware/authentication";
import asyncWrapper from "../util/asyncWrapper";

import login from "./dashboard/login";
import home from "./dashboard/home";

const router = express.Router();

router.use("/login", login);
router.use("/home", home);

router.get("/", asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (req.user.authorizationType === AuthorizationType.Dashboard) {
		res.redirect("/dash/home");
	} else {
		res.redirect("/dash/login");
	}
}));

export default router;
