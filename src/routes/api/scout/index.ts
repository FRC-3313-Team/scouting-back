import * as express from "express";

import team from "./team";

const router = express.Router();

router.use("/team", team);

export default router;
