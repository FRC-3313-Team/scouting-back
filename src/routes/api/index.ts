import * as express from "express";

import device from "./device";
import login from "./login";
import logout from "./logout";

const router = express.Router();

router.use("/device", device);
router.use("/login", login);
router.use("/logout", logout);

export default router;
