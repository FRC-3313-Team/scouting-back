import * as express from "express";

import asyncWrapper from "../../util/asyncWrapper";

const router = express.Router();

router.get("/", asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	res.render("pages/login");
}));

export default router;
