import * as express from "express";

import device from "./device";
import login from "./login";
import logout from "./logout";
import regional from "./regional";

const router = express.Router();

router.use("/device", device);
router.use("/login", login);
router.use("/logout", logout);
router.use("/regional", regional);

export default router;
