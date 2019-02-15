import { Document, Schema, Model, model } from "mongoose";

import { connections } from "../util/db";

export interface IDevice {
	active: boolean;
	name: string;
	activationCode?: string;
	token?: string;
}

export interface IDeviceModel extends IDevice, Document { }

export const DeviceSchema: Schema = new Schema({
	active: Boolean,
	name: String,
	activationCode: String,
	token: String,
});

export const Device: Model<IDeviceModel> = connections.main.model<IDeviceModel>("Device", DeviceSchema);
