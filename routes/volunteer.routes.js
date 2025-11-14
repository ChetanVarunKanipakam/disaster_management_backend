import * as controller from "../controllers/volunteer.controller.js";
import { verifyToken, isVolunteer, isAdmin } from "../middlewares/auth.jwt.js";

export default function(app) {
    // Get a specific volunteer's details
    app.get("/api/volunteers/me", [verifyToken], controller.getVolunteerDetails);

    // A volunteer or admin updates a profile
    app.put("/api/volunteers/:id", [verifyToken], controller.updateVolunteerProfile);

    // Get incidents assigned to a volunteer
    app.get("/api/incidents/assigned-pending/:volunteerId", [verifyToken], controller.getAssignedIncidentsAndPending);
    app.get("/api/incidents/assigned-to/:volunteerId", [verifyToken], controller.getAssignedIncidents);
    app.get("/api/admin/incidents/assigned-to/:volunteerId", [verifyToken], controller.getAssignedIncidents);
    // Admin: Get all volunteers
    app.get("/api/admin/volunteers1", [verifyToken, isAdmin], controller.getAllVolunteers1);
     app.get("/api/admin/volunteers/:id", [verifyToken], controller.getVolunteerDetailsAdmin);
    app.get("/api/admin/volunteers", [verifyToken, isAdmin], controller.getAllVolunteers);
};