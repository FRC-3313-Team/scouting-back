import { Document, Schema, Model } from "mongoose";

import { connections } from "../util/db";

export interface IMatch {
	team: string,
	scores: {
		cargo: {
			top: number,
			middle: number,
			bottom: number,
		},
		hatch: {
			top: number,
			middle: number,
			bottom: number,
		},
		habitat: {
			level: number,
		},
	},
}

export interface IMatchModel extends IMatch, Document {}

export const MatchSchema: Schema = new Schema({
	team: String,
	key: String,
	scores: {
		cargo: {
			top: Boolean,
			middle: Boolean,
			bottom: Boolean,
		},
		hatch: {
			top: Boolean,
			middle: Boolean,
			bottom: Boolean,
		},
		habitat: {
			maxLevel: Number,
		},
	},
});

export const Device: Model<IMatchModel> = connections.main.model<IMatchModel>(
	"Match",
	MatchSchema,
);
