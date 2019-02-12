import * as mongoose from "mongoose";

import config from "./config";

interface IConnections {
	[propName: string]: mongoose.Connection;
}

function createConnection(dbName: string): mongoose.Connection {
	return mongoose.createConnection(`${config.database.url}${dbName}`, { useNewUrlParser: true });
}

export const connections: IConnections = {
	main: createConnection(config.database.mainDatabase),
	// event: createConnection(config.database.eventDatabase), TODO: Connect to correct event database given a TBA event key
};
