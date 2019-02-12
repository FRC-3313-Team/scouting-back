import * as express from "express";

import { AuthorizationType } from "./authentication";
import asyncWrapper from "../util/asyncWrapper";

const requireAuth =
(authorizationType: AuthorizationType): (req: express.Request, res: express.Response, next: express.NextFunction) => void => {
	return asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		if (req.user.authorizationType === authorizationType) {
			return next();
		} else {
			res.status(403)
				.contentType("text/plain")
				.send(`${AuthorizationType[authorizationType]} authorization required to access this endpoint`);
		}
	});
};

export default requireAuth;
