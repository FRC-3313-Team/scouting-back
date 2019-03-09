import { Document, Schema, Model } from "mongoose";

import { connections } from "../util/db";

export interface IRegional {
	active: boolean;
	key: string;
	name: string;
	loaded: boolean;
}

export interface IRegionalModel extends IRegional, Document {}

export const RegionalSchema: Schema = new Schema({
	active: Boolean,
	key: String,
	name: String,
	loaded: Boolean,
});

export const Regional: Model<IRegionalModel> = connections.main.model<IRegionalModel>(
	"Regional",
	RegionalSchema,
);
