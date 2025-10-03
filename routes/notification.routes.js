import * as controller from "../controllers/notification.controller.js";
import { verifyToken } from "../middlewares/auth.jwt.js";

export default function(app) {
    app.get("/api/notifications", [verifyToken], controller.getUserNotifications);
};