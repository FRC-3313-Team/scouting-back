import { AuthorizationType } from "../middleware/authentication";

declare global {
	namespace Express {
		export interface Request {
			user: {
				authorizationType: AuthorizationType
			}
		}
	}
}
