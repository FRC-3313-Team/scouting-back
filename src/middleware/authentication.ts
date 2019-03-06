import * as express from "express";

import config from "../util/config";
import asyncWrapper from "../util/asyncWrapper";
import * as jwt from "jsonwebtoken";

import { Device } from "../models/device";

export enum AuthorizationType {
	None,
	Device,
	Dashboard,
}

export const authentication = asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	req.user = {
		authorizationType: AuthorizationType.None,
	};

	// Device authentication
	const deviceToken = req.headers["device-token"] as string;

	if (deviceToken) {
		const device = await Device.findOne({ token: deviceToken });

		if (device && device.active) {
			req.user.authorizationType = AuthorizationType.Device;
			req.user.device = device;
			return next();
		}
	}

	// Dashboard authentication
	const dashboardToken = req.cookies["dashboard-token"] as string;

	if (dashboardToken) {
		jwt.verify(dashboardToken, config.dashboard.jwtSigningKey, (err, decoded) => {
			if (err) {
				return next();
			}

			// @ts-ignore: this is 100% fine, I promise
			req.user = decoded;

			return next();
		});
	} else {
		return next();
	}
});
