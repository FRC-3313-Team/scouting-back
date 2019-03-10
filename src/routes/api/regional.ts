import axios from "axios";
import * as express from "express";
import config from "../../util/config";

import asyncWrapper from "../../util/asyncWrapper";
import requireAuth from "../../middleware/requireAuth";

import { AuthorizationType } from "../../middleware/authentication";
import { IMatchScheduleEntry, IRegionalInfo, ITBATeam } from "../../types/thebluealliance";
import { Match, IMatchModel, IMatchTeam } from "../../models/match";
import { Regional, IRegionalModel, IRegional } from "../../models/regional";
import { Team } from "../../models/team";

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
				data: {
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
				},
			});
		}
	}

	return teams;
};

const router = express.Router();

router.post("/new",
	requireAuth(AuthorizationType.Dashboard),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	let matchSchedule: Array<IMatchScheduleEntry>;
	let regionalInfo: IRegionalInfo;
	let teamsAtRegional: Array<ITBATeam>;

	if (typeof req.body.key !== "string") {
		return res.status(400)
			.contentType("text/plain")
			.send("must provide regional key");
	}

	const checkForRegional = await Regional.findOne({key: req.body.key});
	if (checkForRegional) {
		return res.status(409)
			.contentType("text/plain")
			.send("this regional has already been loaded");
	}

	try {
		const axiosRes = await axios.get(config.server.theBlueAllianceAPI + "/event/" + req.body.key + "/simple");

		regionalInfo = axiosRes.data;
	} catch (e) {
		if (e.response.status === 404) {
			return res.status(404)
				.contentType("text/plain")
				.send("regional does not exist");
		}

		console.error(e);

		return res.status(500).send();
	}

	try {
		const axiosRes = await axios.get(config.server.theBlueAllianceAPI + "/event/" + req.body.key + "/matches/simple");

		matchSchedule = axiosRes.data;
	} catch (e) {
		console.error(e);

		return res.status(500).send();
	}

	try {
		const axiosRes = await axios.get(config.server.theBlueAllianceAPI + "/event/" + req.body.key + "/teams/simple");

		teamsAtRegional = axiosRes.data;
	} catch (e) {
		console.error(e);

		return res.status(500).send();
	}

	matchSchedule.forEach((match) => {
		if (match.comp_level !== "qm") { return; }

		const newMatch: IMatchModel = new Match({
			regional: req.body.key,
			match: match.comp_level + match.match_number,
			data: [...generateAlliancesWithPrefix(match.alliances.blue.team_keys, "b"),
						...generateAlliancesWithPrefix(match.alliances.red.team_keys, "r")],
		});

		newMatch.save();
	});

	for (const team of teamsAtRegional) {
		const checkForTeam = await Team.findOne({ key: team.key });

		if (checkForTeam && checkForTeam.key === team.key) {
			checkForTeam.regionals.push(regionalInfo.key);

			checkForTeam.save();

			continue;
		}

		const newTeam = new Team({
			key: team.key,
			regionals: [regionalInfo.key],
			data: {
				social: [],
				awards: {
					chairmans: false,
					woodie: false,
					deans: false,
				},
				notes: "",
			},
		});

		newTeam.save();
	}

	const newRegional: IRegionalModel = new Regional({
		active: false,
		key: regionalInfo.key,
		name: regionalInfo.year + " " + regionalInfo.name,
		loaded: true,
	});

	const currentActiveRegional = await Regional.findOne({ active: true });
	if (!currentActiveRegional) {
		newRegional.active = true;
	}

	await newRegional.save();

	const currentRegionals = await Regional.find().lean();

	return res.status(200)
		.send(currentRegionals);
}));

router.get("/list",
	requireAuth(AuthorizationType.Dashboard),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const regionals: Array<IRegional> = await Regional.find().lean();

	return res.status(200)
		.contentType("text/plain")
		.send(regionals);
}));

router.post("/delete",
	requireAuth(AuthorizationType.Dashboard),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (typeof req.body.key !== "string") {
		return res.status(400)
			.contentType("text/plain")
			.send("must provide regional key");
	}

	const regional = await Regional.findOne({ key: req.body.key });

	if (!regional) {
		return res.status(400)
			.contentType("text/plain")
			.send("regional not loaded");
	}

	if (regional.active) {
		return res.status(400)
			.contentType("text/plain")
			.send("cannot delete active regional");
	}

	await Match.deleteMany({ regional: regional.key });
	await regional.remove();

	const currentRegionals = await Regional.find().lean();

	return res.status(200)
		.send(currentRegionals);
}));

router.post("/active",
	requireAuth(AuthorizationType.Dashboard),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (typeof req.body.key !== "string") {
		return res.status(400)
			.contentType("text/plain")
			.send("must provide regional key");
	}

	const regional = await Regional.findOne({ key: req.body.key });
	if (!regional) {
		return res.status(400)
			.contentType("text/plain")
			.send("regional not loaded");
	}

	const currentActiveRegional = await Regional.findOne({ active: true });
	if (currentActiveRegional && currentActiveRegional.key !== regional.key) {
		currentActiveRegional.active = false;
		await currentActiveRegional.save();
	}

	regional.active = true;
	await regional.save();

	const currentRegionals = await Regional.find().lean();

	return res.status(200)
		.send(currentRegionals);
}));

export default router;
