import { verifyToken } from "../middlewares/auth.jwt.js";
import * as controller from "../controllers/notification.controller.js";

export default function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // GET route to fetch all notifications for the current user
    app.get(
        "/api/notifications/me",
        [verifyToken],
        controller.getUserNotifications
    );

    // (Optional but recommended) PUT route to mark a notification as read
    app.put(
        "/api/notifications/:id/read",
        [verifyToken],
        controller.markAsRead
    );
};