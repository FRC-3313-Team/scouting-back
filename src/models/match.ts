import { Document, Schema, Model } from "mongoose";

import { connections } from "../util/db";

export interface IMatchTeam {
	team: string,
	position: string,
	scouted: false,
	auto: {
		hatch: boolean,
		cargo: boolean,
		movement: boolean,
	},
	habitat: {
		start: number,
		end: number,
	},
	rocket: {
		hatch: [number, number, number],
		cargo: [number, number, number],
	},
	pod: {
		hatch: number,
		cargo: number,
	},
	defense: boolean,
	notes: string,
}

export interface IMatch {
	match: string,
	regional: string,
	data: Array<IMatchTeam>,
}

export interface IMatchModel extends IMatch, Document {}

export const MatchTeamSchema: Schema = new Schema({
	team: String,
	position: String,
	scouted: Boolean,
	auto: {
		hatch: Boolean,
		cargo: Boolean,
		movement: Boolean,
	},
	habitat: {
		start: Number,
		end: Number,
	},
	rocket: {
		hatch: [Number],
		cargo: [Number],
	},
	pod: {
		hatch: Number,
		cargo: Number,
	},
	defense: Boolean,
	notes: String,
});

export const MatchSchema: Schema = new Schema({
	match: String,
	regional: String,
	data: [MatchTeamSchema],
});

export const Match: Model<IMatchModel> = connections.main.model<IMatchModel>(
	"Match",
	MatchSchema,
);
