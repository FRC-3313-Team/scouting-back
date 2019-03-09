import * as ini from "ini";
import * as fs from "fs";

interface IConfig {
	server: {
		port: number,
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

const appConfig = ini.parse(fs.readFileSync("./src/config/app.ini", "utf-8")) as IConfig;
const fallbackConfig = ini.parse(fs.readFileSync("./src/config/app.example.ini", "utf-8")) as IConfig;

const mergedConfig: IConfig = { ...fallbackConfig, ...appConfig };

export default mergedConfig;
