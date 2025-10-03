import * as controller from "../controllers/user.controller.js";
import { verifyToken, isVolunteer } from "../middlewares/auth.jwt.js";
export default function(app) {
  // Get current user's profile
  app.get("/api/users/me", [verifyToken], controller.getCurrentUserProfile);
  
  // Update current user's profile
  app.put("/api/users/me", [verifyToken], controller.updateCurrentUserProfile);
};