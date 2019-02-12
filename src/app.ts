import * as path from "path";

import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as morgan from "morgan";

import { authentication } from "./middleware/authentication";

import api from "./routes/api";
import dashboard from "./routes/dashboard";

class App {
  public app: express.Application;

  constructor() {
		this.app = express();

		this.config();
		this.middleware();
		this.routes();
	}

	private config(): void {
		this.app.set("view engine", "ejs");
		this.app.set("views", path.join(__dirname, "../views"));
	}

  private middleware(): void {
		this.app.use(morgan("dev"));
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(cookieParser());

		this.app.use(authentication);
  }

  private routes(): void {
		this.app.use(express.static("static"));
		this.app.use("/favicon.ico", express.static("static/img/favicon.ico"));

		this.app.use("/dash", dashboard);
		this.app.use("/api", api);

		this.app.use("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
			if (req.url === "/") {
				res.redirect("/dash");
			} else {
				next();
			}
		});

		this.app.use("*", (req: express.Request, res: express.Response) => {
			res.status(404)
				.render("pages/404");
		});
  }
}

export default new App().app;
