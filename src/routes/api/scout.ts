import * as express from "express";

import asyncWrapper from "../../util/asyncWrapper";
import requireAuth from "../../middleware/requireAuth";

import { AuthorizationType } from "../../middleware/authentication";
import { Match, IMatchData } from "../../models/match";
import { Regional } from "../../models/regional";
import { ITeamData, Team } from "../../models/team";

interface IMatchDelta {
	type: "match",
	regional: string,
	match: string,
	team: string,
	data: IMatchData,
}

interface ITeamDelta {
	type: "team",
	team: string,
	data: ITeamData,
}

const router = express.Router();

router.get("/matches",
	requireAuth(AuthorizationType.Device),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (typeof req.query.regional !== "string") {
		return res.status(400)
			.contentType("text/plain")
			.send("missing regional property in query");
	}

	const regional = await Regional.findOne({ key: req.query.regional });
	if (!regional) {
		return res.status(404)
			.contentType("text/plain")
			.send("regional does not exist or it has not been loaded in the dashboard");
	}

	const matches = await Match.find({ regional: regional.key }).lean();

	res.status(200)
		.send({ matches });
}));

router.get("/teams",
	requireAuth(AuthorizationType.Device),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (typeof req.query.regional !== "string") {
		return res.status(400)
			.contentType("text/plain")
			.send("missing regional property in query");
	}

	const regional = await Regional.findOne({ key: req.query.regional });
	if (!regional) {
		return res.status(404)
			.contentType("text/plain")
			.send("regional does not exist or it has not been loaded in the dashboard");
	}

	const teams = await Team.find({ regionals: regional.key }).lean();

	res.status(200)
		.send({ teams });
}));

router.post("/upload",
	requireAuth(AuthorizationType.Device),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {

	if (!Array.isArray(req.body)) {
		return res.status(400)
			.contentType("text/plain")
			.send("body must be an array");
	}

	for (const change of req.body) {
		if (change.type === "match") {
			const delta: IMatchDelta = change;

			if (!delta.regional || !delta.match) {
				return res.status(400)
					.contentType("text/plain")
					.send("missing regional or match property");
			}

			const match = await Match.findOne({ regional: delta.regional, match: delta.match });

			if (!match) {
				continue;
			}

			// This loop searchs for the corresponding team in the match data
			for (const i in match.data) {
				if (match.data.hasOwnProperty(i) && match.data[i].team === delta.team) {
					match.data[i].data = delta.data;
					match.data[i].scouted = true;
				}
			}

			await match.save();
		} else if (change.type === "team") {
			const delta: ITeamDelta = change;
			const team = await Team.findOne({ key: delta.team });

			if (!team) {
				continue;
			}

			team.data = delta.data;

			await team.save();
		}
	}

	res.sendStatus(200);
}));

export default router;
