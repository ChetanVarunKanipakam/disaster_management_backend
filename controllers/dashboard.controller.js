import db from "../models/index.js";
const Incident = db.Incident;
const Volunteer = db.Volunteer;
const { Op } = db.Sequelize;

export const getDashboardStats = async (req, res) => {
    try {
        // Incident stats
        const incidentCounts = await Incident.findAll({
            attributes: [
                'severity',
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
            ],
            group: ['severity']
        });

        const incidentStatusCounts = await Incident.findAll({
            attributes: [
                'status',
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
            ],
            group: ['status']
        });

        // Volunteer stats
        const activeVolunteers = await Volunteer.count({ where: { isAvailable: true } });

        // Recent incidents
        const recentIncidents = await Incident.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).send({
            incidentCounts,
            incidentStatusCounts,
            activeVolunteers,
            recentIncidents
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};