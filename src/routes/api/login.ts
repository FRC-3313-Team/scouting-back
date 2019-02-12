import * as express from "express";
import * as jwt from "jsonwebtoken";

import config from "../../util/config";
import asyncWrapper from "../../util/asyncWrapper";
import { AuthorizationType } from "../../middleware/authentication";

const router = express.Router();

router.post("/", asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const password = req.body.password;

	if (password === config.dashboard.password) {
		const payload = {
			authorizationType: AuthorizationType.Dashboard,
		};
		const signedToken = jwt.sign(payload, config.dashboard.jwtSigningKey, { expiresIn: "1h" });

		res.status(200)
			.cookie("dashboard-token", signedToken)
			.send();
	} else {
		res.status(403)
			.send();
	}
}));

export default router;
