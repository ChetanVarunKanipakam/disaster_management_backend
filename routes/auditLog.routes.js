import * as controller from "../controllers/auditLog.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.jwt.js";

export default function(app) {
    app.get("/api/admin/audit-logs", [verifyToken, isAdmin], controller.getAuditLogs);
};