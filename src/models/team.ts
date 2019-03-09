import { Document, Schema, Model } from "mongoose";

import { connections } from "../util/db";

export interface ITeamSocial {
	site: string,
	handle: string,
}

export const TeamSocialSchema: Schema = new Schema({
	site: String,
	handle: String,
});

export interface ITeam {
	key: string,
	data: {
		social: Array<ITeamSocial>,
		awards: {
			chairmans: boolean,
			woodie: boolean,
			deans: boolean,
		},
		notes: string,
	}
}

export interface ITeamModel extends ITeam, Document {}

export const TeamSchema: Schema = new Schema({
	key: String,
	data: {
		social: [TeamSocialSchema],
		awards: {
			chairmans: Boolean,
			woodie: Boolean,
			deans: Boolean,
		},
		notes: String,
	},
});

export const Team: Model<ITeamModel> = connections.main.model<ITeamModel>(
	"Team",
	TeamSchema,
);
