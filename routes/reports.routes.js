import * as controller from "../controllers/reports.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.jwt.js";
import express from "express";

export default function(app) {
    const router = express.Router();
    router.use(verifyToken, isAdmin);

    router.get("/incidents", controller.getIncidentsReport);
    router.get("/response-times", controller.getResponseTimeReport);
    router.get("/hotspots", controller.getHotspotsReport);
    
    // This export endpoint is separate as it might have different usage patterns

    app.use('/api/admin/reports', router);
};