import db from "../models/index.js";
const Volunteer = db.Volunteer;
const Incident = db.Incident;
const User = db.User;

// Get a volunteer's details (profile)
export const getVolunteerDetails = async (req, res) => {
    try {
        const volunteer = await Volunteer.findOne({
            where: { userId: req.params.id },
            include: { model: User, as: 'userProfile', attributes: ['name', 'email', 'phone'] }
        });
        if (!volunteer) return res.status(404).send({ message: "Volunteer not found." });
        res.status(200).send(volunteer);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Update a volunteer's availability and location
export const updateVolunteerProfile = async (req, res) => {
    // Ensure only the volunteer themselves or an admin can update
    if (req.userId !== req.params.id && req.userRole !== 'ADMIN') {
        return res.status(403).send({ message: "Forbidden: You cannot update another volunteer's profile." });
    }
    
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(404).send({ message: "Volunteer not found." });

        const { isAvailable, latitude, longitude } = req.body;
        let location;
        if (latitude && longitude) {
            location = { type: 'Point', coordinates: [longitude, latitude] };
        }

        await volunteer.update({
            isAvailable: isAvailable,
            lastKnownLocation: location,
        });

        // Optional: Trigger websocket event volunteer:update
        res.status(200).send({ message: "Volunteer profile updated." });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get all incidents assigned to a specific volunteer
export const getAssignedIncidents = async (req, res) => {
    try {
        const incidents = await Incident.findAll({
            where: { assignedToId: req.params.volunteerId },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).send(incidents);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Admin: Get all volunteers
export const getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.findAll({
            include: {
                model: User,
                as: 'userProfile',
                attributes: ['name', 'email', 'phone', 'isActive']
            }
        });
        console.log(volunteers);
        res.status(200).send(volunteers);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};