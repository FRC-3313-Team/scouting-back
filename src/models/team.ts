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

export interface ITeamData {
	social: Array<ITeamSocial>,
	awards: {
		[key: string]: boolean,
	},
	outreach: string,
}

export const TeamDataSchema: Schema = new Schema({
	social: [TeamSocialSchema],
	awards: {
		type: Map,
		of: Boolean,
	},
	outreach: String,
});

export interface ITeam {
	key: string,
	name: string,
	regionals: Array<string>,
	data: ITeamData,
}

export const TeamSchema: Schema = new Schema({
	key: String,
	name: String,
	regionals: [String],
	data: TeamDataSchema,
});

export interface ITeamModel extends ITeam, Document {}

export const Team: Model<ITeamModel> = connections.main.model<ITeamModel>(
	"Team",
	TeamSchema,
);
