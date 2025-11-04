import * as controller from "../controllers/incident.controller.js";
import { verifyToken, isVolunteer } from "../middlewares/auth.jwt.js";
import upload from "../middlewares/upload.js";

export default function(app) {
  app.post("/api/incidents", [verifyToken, upload], controller.createIncident);
  app.get("/api/incidents/nearby", controller.getNearbyIncidents);
  app.get("/api/incidents/my-reports", [verifyToken], controller.getMyReports);
  app.get("/api/incidents/:id", [verifyToken], controller.getIncidentDetails);
  app.get("/api/admin/incidents/:id", [verifyToken], controller.getIncidentDetails);
  app.put("/api/incidents/:id/status", [verifyToken, isVolunteer], controller.updateIncidentStatus);
  app.put("/api/admin/incidents/:id/status", [verifyToken, isVolunteer], controller.updateIncidentStatus);
};