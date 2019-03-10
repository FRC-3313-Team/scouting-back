import * as express from "express";
import * as rand from "csprng";

import config from "../../util/config";
import asyncWrapper from "../../util/asyncWrapper";
import requireAuth from "../../middleware/requireAuth";

import { Device, IDevice, IDeviceModel } from "../../models/device";
import { AuthorizationType } from "../../middleware/authentication";
import { Regional } from "../../models/regional";

const router = express.Router();

const sanitizeDevices = (devices: Array<IDeviceModel>) => {
	const sanitized: Array<IDevice> = [];

	devices.forEach((device) => {
		sanitized.push({
			name: device.name,
			active: device.active,
			driverStation: device.driverStation,
			activationCode: device.activationCode,
		});
	});

	return sanitized;
};

router.get("/list",
	requireAuth(AuthorizationType.Dashboard),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const devices = await Device.find();
	const sanitized = sanitizeDevices(devices);

	res.status(200)
		.send(sanitized);
}));

router.post("/new",
	requireAuth(AuthorizationType.Dashboard),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const deviceName = req.body.name ? req.body.name : rand(25, 36);

	const checkForExistingName = await Device.findOne({ name: deviceName });
	if (checkForExistingName) {
		return res.status(409)
			.contentType("text/plain")
			.send("a device with this name already exists");
	}

	let newDevice = new Device({
		active: false,
		name: deviceName,
		driverStation: "r1",
		activationCode: rand(config.device.activationCodeLength * 3, 10),
	});

	newDevice = await newDevice.save();

	const devices = await Device.find();
	const sanitized = sanitizeDevices(devices);

	res.status(200)
		.send(sanitized);
}));

router.post("/setDriverStation",
	requireAuth(AuthorizationType.Dashboard),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (typeof req.body.name !== "string") {
		return res.status(400)
			.contentType("text/plain")
			.send("must provide a string name");
	}

	const device = await Device.findOne({ name: req.body.name });
	if (device === null) {
		return res.status(400)
			.contentType("text/plain")
			.send("invalid name");
	}

	device.driverStation = req.body.station;

	await device.save();

	const devices = await Device.find();
	const sanitized = sanitizeDevices(devices);

	res.status(200)
		.send(sanitized);
}));

router.post("/register", asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (!req.body.activationCode) {
		return res.status(400)
			.contentType("text/plain")
			.send("no code provided");
	}

	let device = await Device.findOne({ activationCode: req.body.activationCode });

	if (device === null) {
		return res.status(400)
			.contentType("text/plain")
			.send("invalid code");
	}

	device.activationCode = undefined;
	device.active = true;
	device.token = rand(512, 36);

	device = await device.save();

	res.status(200).send({
		token: device.token,
	});
}));

router.post("/delete",
	requireAuth(AuthorizationType.Dashboard),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const device = await Device.findOne({ name: req.body.name });

	if (device === null) {
		return res.status(400)
			.contentType("text/plain")
			.send("invalid name");
	}

	await device.remove();

	const devices = await Device.find();
	const sanitized = sanitizeDevices(devices);

	res.status(200)
		.send(sanitized);
}));

router.get("/status",
	requireAuth(AuthorizationType.Device),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const device = req.user.device as IDeviceModel;

	let regionalKey: string | null = null;

	const activeRegional = await Regional.findOne({ active: true });

	if (activeRegional) {
		regionalKey = activeRegional.key;
	}

	res.status(200).send({
		name: device.name,
		defaultDriverStation: device.driverStation,
		regional: regionalKey,
	});
}));

export default router;
