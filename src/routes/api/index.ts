import * as express from "express";

import device from "./device";
import login from "./login";
import logout from "./logout";
import regional from "./regional";
import scout from "./scout";

const router = express.Router();

router.use("/device", device);
router.use("/login", login);
router.use("/logout", logout);
router.use("/regional", regional);
router.use("/scout", scout);

export default router;
