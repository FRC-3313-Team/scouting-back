import * as express from "express";

import device from "./api/device";
import login from "./api/login";
import logout from "./api/logout";

const router = express.Router();

router.use("/device", device);
router.use("/login", login);
router.use("/logout", logout);

export default router;
