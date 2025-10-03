import * as controller from "../controllers/dashboard.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.jwt.js";

export default function(app) {
    // This combines multiple stats endpoints into one for efficiency
    app.get("/api/admin/dashboard/stats", [verifyToken, isAdmin], controller.getDashboardStats);
};