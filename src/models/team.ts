import { Document, Schema, Model } from "mongoose";

import { connections } from "../util/db";

export interface ITeam {
	key: string,
	abilities: {
		cargo: {
			top: boolean,
			middle: boolean,
			bottom: boolean
		},
		hatch: {
			top: boolean,
			middle: boolean,
			bottom: boolean
		},
		habitat: {
			maxLevel: number
		}
	}
}

export interface ITeamModel extends ITeam, Document {}

export const TeamSchema: Schema = new Schema({
	key: String,
	abilities: {
		cargo: {
			top: Boolean,
			middle: Boolean,
			bottom: Boolean
		},
		hatch: {
			top: Boolean,
			middle: Boolean,
			bottom: Boolean
		},
		habitat: {
			maxLevel: Number
		}
	}
});

export const Device: Model<ITeamModel> = connections.main.model<ITeamModel>(
	"Team",
	TeamSchema
);
