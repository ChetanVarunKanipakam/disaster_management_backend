import db from "../models/index.js";
const Incident = db.Incident;
const User = db.User;
const Volunteer = db.Volunteer;
const { Op } = db.Sequelize;


// --- Incident Management ---

export const getAllIncidents = async (req, res) => {
    const { status, severity, type="FIRE" } = req.query;
    const {limit = 20, offset = 0} =req.params;
    let whereClause = {};
    console.log(req.query,req.params)
    if (status) whereClause.status = status;
    if (severity) whereClause.severity = severity;
    if (type) whereClause.type = type;

    try {
        const incidents = await Incident.findAndCountAll({
            where: whereClause,
            include: [
                { model: User, as: 'reporter', attributes: ['id', 'name'] },
                { model: User, as: 'assignedVolunteer', attributes: ['id', 'name'] }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });
        res.status(200).send(incidents);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


export const assignVolunteerToIncident = async (req, res) => {
    const { incidentId } = req.params;
    const { volunteerId } = req.body;

    try {
        const incident = await Incident.findByPk(incidentId);
        if (!incident) return res.status(404).send({ message: "Incident not found." });

        const volunteer = await User.findOne({ where: { id: volunteerId, role: 'VOLUNTEER' }});
        if (!volunteer) return res.status(404).send({ message: "Volunteer not found." });

        incident.assignedToId = volunteerId;
        // Optionally set status to Acknowledged
        if (incident.status === 'PENDING') {
            incident.status = 'ACKNOWLEDGED';
        }
        await incident.save();
        
        // Here you trigger notifications to the volunteer
        res.status(200).send({ message: "Volunteer assigned successfully." });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// --- User Management ---
export const getAllUsers = async (req, res) => {
    const { role } = req.query;
    let whereClause = {};
    console.log(req.query);
    if (role) whereClause.role = role.toUpperCase();
    
    try {
        const users = await User.findAll({ 
            where: whereClause,
            attributes: { exclude: ['password'] } 
        });
        console.log(users);
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    const { id } = req.params; // Changed from body to params
    const { newRole } = req.body;
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).send({ message: "User not found." });

        user.role = newRole;
        await user.save();
        // Add/remove from Volunteer table if necessary
        if (newRole === 'VOLUNTEER' && !(await Volunteer.findByPk(userId))) {
            await Volunteer.create({ userId: userId });
        } else if (newRole !== 'VOLUNTEER') {
            await Volunteer.destroy({ where: { userId: userId }});
        }

        res.status(200).send({ message: "User role updated." });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).send({ message: "User not found." });

        user.isActive = false; // Soft delete
        await user.save();
        
        res.status(200).send({ message: "User has been suspended." });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};