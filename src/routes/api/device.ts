import * as express from "express";
import * as rand from "csprng";
import * as uuid from "uuid";

import config from "../../util/config";
import asyncWrapper from "../../util/asyncWrapper";
import requireAuth from "../../middleware/requireAuth";

import { Device, IDevice, IDeviceModel } from "../../models/device";
import { AuthorizationType } from "../../middleware/authentication";

const router = express.Router();

const sanitizeDevices = (devices: IDeviceModel[]) => {
	const sanitized: IDevice[] = []

	devices.forEach((device) => {
		sanitized.push({
			name: device.name,
			active: device.active
		})
	})

	return sanitized
}

router.get("/list",
	requireAuth(AuthorizationType.Dashboard),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const devices = await Device.find()
	const sanitized = sanitizeDevices(devices)

	res.status(200)
	.send(sanitized)
}));

router.post("/new",
	requireAuth(AuthorizationType.Dashboard),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const deviceName = req.body.name ? req.body.name : rand(12, 36);

	const checkForExistingName = await Device.findOne({ name: deviceName });
	if (checkForExistingName) {
		return res.status(409)
			.contentType("text/plain")
			.send("a device with this name already exists");
	}

	let newDevice = new Device({
		active: false,
		name: deviceName,
		activationCode: rand(config.device.activationCodeLength * 3, 10),
	});

	newDevice = await newDevice.save();

	res.status(200).send({
		code: newDevice.activationCode,
		name: newDevice.name,
	});
}));

router.post("/register", asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	let device = await Device.findOne({ activationCode: req.body.activationCode });

	if (device === null) {
		return res.status(400)
			.contentType("text/plain")
			.send("invalid code");
	}

	device.activationCode = undefined;
	device.active = true;
	device.token = uuid.v4();

	device = await device.save();

	res.status(200).send({
		token: device.token,
	});
}));

router.post("/delete",
	requireAuth(AuthorizationType.Dashboard),
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	let device = await Device.findOne({ name: req.body.name });

	if (device === null) {
		return res.status(400)
			.contentType("text/plain")
			.send("invalid name");
	}

	await device.remove()

	const devices = await Device.find()
	const sanitized = sanitizeDevices(devices)

	res.status(200)
	.send(sanitized)
}));

export default router;
