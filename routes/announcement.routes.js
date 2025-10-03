import * as controller from "../controllers/announcement.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.jwt.js";
import { logAction } from "../middlewares/audit.logger.js";
import express from "express";

export default function(app) {
    const router = express.Router();
    router.use(verifyToken, isAdmin);

    router.post("/", logAction('CREATE ANNOUNCEMENT'), controller.createAnnouncement);
    router.get("/", controller.getAllAnnouncements);

    app.use('/api/admin/announcements', router);
};