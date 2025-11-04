
import { Op } from "sequelize";
import db from "../models/index.js";
const Incident = db.Incident;
const User = db.User;
const sequelize = db.sequelize;
const Notification = db.Notification;
// Citizen: Report a new incident
export const createIncident = (req, res) => {
    // The photo URL will be based on where you serve the static files
    const photoUrl = req.file ? `/uploads/incidents/${req.file.filename}` : null;
    
    const location = { 
        type: 'Point', 
        coordinates: [req.body.longitude, req.body.latitude] // [lng, lat] format
    };
    // console.log(req.body);
    Incident.create({
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        severity: req.body.severity,
        location: location,
        photoUrl: photoUrl,
        reportedById: req.userId, // From verifyToken middleware
    })
    .then(incident => {
        // Here you would trigger a WebSocket event: incident:new
        console.log(incident);
        res.status(201).send({ message: "Incident reported successfully!", incidentId: incident.id });
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({ message: err.message });
    });
};

// Citizen/Volunteer: Get nearby incidents
export const getNearbyIncidents = async (req, res) => {
    // const { lat, lon, radius = 10000, severity, type ,status} = req.query; // radius in meters
    const { lat, lon, radius = 10000} = req.query; 
    // console.log(req.query);
    if (!lat || !lon) {
        return res.status(400).send({ message: "Latitude and Longitude are required."});
    }

    const location = sequelize.literal(`ST_GeomFromText('POINT(${lon} ${lat})')`);
    const distance = sequelize.fn('ST_DistanceSphere', sequelize.col('location'), location);

    const whereClause = [
        sequelize.where(distance, { [Op.lte]: parseInt(radius) })
    ];

// if (status) whereClause.push({ status });
// if (severity) whereClause.push({ severity });
// if (type) whereClause.push({ type });




    // if (!status) {
    //     whereClause.status = { [Op.not]: 'RESOLVED' };
    // } else {
    //     whereClause.status = status;
    // }

    // if (severity) whereClause.severity = severity;
    // if (type) whereClause.type = type;
    
    try {
        const incidents = await Incident.findAll({
            attributes: { include: [[distance, 'distance']] },
            where: { [Op.and]: whereClause },
            order: [['createdAt', 'DESC']]
        });
        console.log(incidents);
        res.status(200).send(incidents);
    } catch (error) {
        // console.error("error",error);
        res.status(500).send({ message: error.message });
    }
};

// Citizen/Volunteer: Get a single incident's details
export const getIncidentDetails = async (req, res) => {
    try {
        const incident = await Incident.findByPk(req.params.id, {
            include: [
                { model: User, as: 'reporter', attributes: ['id', 'name'] },
                { model: User, as: 'assignedVolunteer', attributes: ['id', 'name'] }
            ]
        });
        console.log(incident.dataValues);
        if (!incident) return res.status(404).send({ message: "Incident not found." });
        res.status(200).send(incident.dataValues);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Citizen: Get their own reported incidents
export const getMyReports = async (req, res) => {
    try {
        const incidents = await Incident.findAll({
            where: { reportedById: req.userId },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).send(incidents);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Volunteer: Update incident status
export const updateIncidentStatus = async (req, res) => {
    const { status } = req.body;
    // You might want to add 'NEW' if admins can revert it
    const validStatuses = ['IN_PROGRESS', 'RESOLVED']; 
    if (!validStatuses.includes(status)) {
        return res.status(400).send({ message: "Invalid status."});
    }
    
    try {
        const incident = await Incident.findByPk(req.params.id);
        if (!incident) return res.status(404).send({ message: "Incident not found." });

        // Authorization check
        const user = await User.findByPk(req.userId);
        if (user.role !== 'ADMIN' && incident.assignedToId !== req.userId) {
            return res.status(403).send({ message: "You are not authorized to update this incident."});
        }

        incident.status = status;
        if (status === 'RESOLVED') {
            incident.resolvedAt = new Date();
        }
        await incident.save();

        // --- NOTIFICATION LOGIC ---
        // 3. Notify the citizen who reported the incident about the status change.
        // Assumes your Incident model has a 'reportedById' field.
        if (incident.reportedById && incident.reportedById !== req.userId) { // Don't notify users about their own actions
            await Notification.create({
                title: 'Incident Status Updated',
                body: `The status of your reported incident "${incident.title}" has been updated to ${status}.`,
                userId: incident.reportedById, // The recipient
                incidentId: incident.id, // Link to the incident
            });
        }
        // --- END NOTIFICATION LOGIC ---

        res.status(200).send({ message: `Incident status updated to ${status}` });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};