import db from "../models/index.js";
const AuditLog = db.AuditLog;

// Middleware factory to create a logger for specific actions
export const logAction = (action) => {
  return async (req, res, next) => {
    // Proceed with the actual controller logic first
    next();

    // After the response is sent, log the action
    res.on('finish', async () => {
      // We only log successful actions
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await AuditLog.create({
            adminId: req.userId, // The logged-in admin's ID from JWT
            action: `${action} (Target ID: ${req.params.id || req.body.userId || req.params.incidentId || 'N/A'})`,
            targetEntity: action.split(' ')[1] || 'SYSTEM', // e.g., 'USER', 'INCIDENT'
            targetId: req.params.id || req.body.userId || req.params.incidentId
          });
        } catch (error) {
          console.error('Failed to create audit log:', error);
        }
      }
    });
  };
};