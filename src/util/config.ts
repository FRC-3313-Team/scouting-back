import * as ini from "ini";
import * as fs from "fs";

interface IConfig {
	server: {
		port: number,
		theBlueAllianceAPI: string,
	}

	database: {
		url: string,
		database: string,
	}

	device: {
		activationCodeLength: number,
	}

	dashboard: {
		password: string,
		jwtSigningKey: string,
	}

	event: {
		regional: string,
	}

	external: {
		theBlueAllianceKey: string,
	}
}

const appConfig = ini.parse(fs.readFileSync("./config/app.ini", "utf-8")) as IConfig;
const fallbackConfig = ini.parse(fs.readFileSync("./config/app.example.ini", "utf-8")) as IConfig;

const mergedConfig: IConfig = { ...fallbackConfig, ...appConfig };

export default mergedConfig;
