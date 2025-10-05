import db from "../models/index.js";
import { Parser } from 'json2csv';
const Incident = db.Incident;
const Volunteer = db.Volunteer;
const sequelize = db.sequelize;
const { Op } = db.Sequelize;

// GET /reports/incidents
export const getIncidentsReport = async (req, res) => {
    try {
        const report = await Incident.findAll({
            attributes: [
                'type',
                'severity',
                [sequelize.fn('COUNT', sequelize.col('id')), 'total_incidents']
            ],
            group: ['type', 'severity'],
            order: [['type'], ['severity']]
        });
        res.status(200).json(report);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// GET /reports/response-times
export const getResponseTimeReport = async (req, res) => {
    try {
        const incidents = await Incident.findAll({
            where: {
                status: 'RESOLVED',
                resolvedAt: { [Op.ne]: null }
            },
            attributes: [
                'id',
                'type',
                [sequelize.fn('EXTRACT', sequelize.literal('EPOCH FROM ("resolvedAt" - "createdAt")')), 'resolve_duration_seconds']
            ]
        });

        // Calculate average
        const totalDuration = incidents.reduce((sum, inc) => sum + inc.dataValues.resolve_duration_seconds, 0);
        const averageSeconds = totalDuration / incidents.length || 0;

        res.status(200).json({
            averageResolveTimeSeconds: averageSeconds,
            averageResolveTimeMinutes: averageSeconds / 60,
            totalResolvedIncidents: incidents.length
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// GET /reports/hotspots
export const getHotspotsReport = async (req, res) => {
    try {
        // Provides raw location data for a frontend heatmap library like Leaflet Heat
        const incidents = await Incident.findAll({
            attributes: [
                [sequelize.fn('ST_Y', sequelize.col('location')), 'latitude'],
                [sequelize.fn('ST_X', sequelize.col('location')), 'longitude']
            ],
            where: {
                createdAt: {
                    [Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                }
            }
        });
        res.status(200).json(incidents);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
