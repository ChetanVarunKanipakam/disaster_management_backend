import * as controller from "../controllers/settings.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.jwt.js";
import { logAction } from "../middlewares/audit.logger.js";

export default function(app) {
    const router = require("express").Router();
    router.use(verifyToken, isAdmin);

    router.get("/", controller.getSettings);
    router.put("/", logAction('UPDATE SETTINGS'), controller.updateSettings);

    app.use('/api/admin/settings', router);
};