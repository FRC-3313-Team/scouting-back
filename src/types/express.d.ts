import { AuthorizationType } from "../middleware/authentication";
import { IDeviceModel } from "../models/device";

declare global {
	namespace Express {
		export interface Request {
			user: {
				authorizationType: AuthorizationType
				device?: IDeviceModel
			}
		}
	}
}
