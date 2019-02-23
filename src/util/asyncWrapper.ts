import * as express from "express";

const asyncWrapper = (fn: any) =>
	(req: express.Request, res: express.Response, next: express.NextFunction) => {
	Promise.resolve(fn(req, res, next))
		.catch(next);
};

export default asyncWrapper;
