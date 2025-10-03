import db from "../models/index.js";
const AuditLog = db.AuditLog;

// GET /audit-logs
export const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.findAll({
            include: [{ model: db.User, as: 'admin', attributes: ['id', 'name'] }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};