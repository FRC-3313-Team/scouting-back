import axios from "axios";
import * as express from "express";
import config from "../../util/config";

import asyncWrapper from "../../util/asyncWrapper";
import requireAuth from "../../middleware/requireAuth";

import { AuthorizationType } from "../../middleware/authentication";
import { IMatchScheduleEntry } from "../../types/thebluealliance";
import { Match, IMatchModel, IMatchTeam } from "../../models/match";

axios.defaults.headers.get["X-TBA-Auth-Key"] = config.external.theBlueAllianceKey;

const generateAlliancesWithPrefix = (teamKeys: Array<string>, prefix: string) => {
	const teams: Array<IMatchTeam> = [];

	for (const i in teamKeys) {
		if (teamKeys.hasOwnProperty(i)) {
			const teamKey = teamKeys[i];

			teams.push({
				team: teamKey,
				position: prefix + (+i + 1),
				scouted: false,
				auto: {
					hatch: false,
					cargo: false,
					movement: false,
				},
				habitat: {
					start: 0,
					end: 0,
				},
				rocket: {
					cargo: [0, 0, 0],
					hatch: [0, 0, 0],
				},
				pod: {
					hatch: 0,
					cargo: 0,
				},
				defense: false,
				notes: "",
			});
		}
	}

	return teams;
};

const router = express.Router();

router.post("/load",
	requireAuth(AuthorizationType.Dashboard),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	let eventData: Array<IMatchScheduleEntry>;

	try {
		const axiosRes = await axios.get("https://www.thebluealliance.com/api/v3/event/" + req.body.event + "/matches/simple");

		eventData = axiosRes.data;
	} catch (e) {
		console.error(e);

		return res.status(500).send();
	}

	eventData.forEach((match) => {
		if (match.comp_level !== "qm") { return; }

		const newMatch: IMatchModel = new Match({
			regional: req.body.event,
			match: match.comp_level + match.match_number,
			data: [...generateAlliancesWithPrefix(match.alliances.blue.team_keys, "b"),
						...generateAlliancesWithPrefix(match.alliances.red.team_keys, "r")],
		});

		newMatch.save();
	});

	res.send("loaded");
}));

export default router;
