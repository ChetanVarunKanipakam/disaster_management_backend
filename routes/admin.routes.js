import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.jwt.js";
import { logAction } from "../middlewares/audit.logger.js"; // Import logger

export default function(app) {
    const adminRouter = express.Router();
    adminRouter.use(verifyToken, isAdmin);

    // Incident Management
    adminRouter.get("/incidents", adminController.getAllIncidents);
    adminRouter.put("/incidents/:incidentId/assign", logAction('ASSIGN INCIDENT'), adminController.assignVolunteerToIncident);
    // User Management
    adminRouter.get("/users", adminController.getAllUsers);
    adminRouter.put("/users/:id/role", logAction('UPDATE USER_ROLE'), adminController.updateUserRole);
    adminRouter.delete("/users/:id", logAction('SUSPEND USER'), adminController.deleteUser);
    
    app.use('/api/admin', adminRouter);
};