import db from "../models/index.js";
const Incident = db.Incident;
const User = db.User;
const Volunteer = db.Volunteer;
const { Op } = db.Sequelize;
const Notification = db.Notification;

// --- Incident Management ---

export const getAllIncidents = async (req, res) => {
    const { status, severity } = req.query;
    const {limit = 20, offset = 0} =req.params;
    let whereClause = {};
    console.log(req.query,req.params)
    if (status) whereClause.status = status;
    if (severity) whereClause.severity = severity;

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
        if (incident.status === 'NEW') { // Assuming 'NEW' is the initial status
            incident.status = 'IN_PROGRESS'; // Or ACKNOWLEDGED
        }
        await incident.save();

        // --- NOTIFICATION LOGIC ---
        // 2. Create a notification for the assigned volunteer.
        await Notification.create({
            title: 'New Assignment',
            body: `You have been assigned to the incident: "${incident.title}".`,
            userId: volunteer.id, // The recipient of the notification
            incidentId: incident.id, // Link the notification to the incident
        });
        // --- END NOTIFICATION LOGIC ---

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
    const { id } = req.params;
    const { newRole } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).send({ message: "User not found." });

        // Prevent changing own role if not an admin, or other security checks...
        
        const oldRole = user.role;
        user.role = newRole;
        await user.save();
        
        // BUG FIX: Changed 'userId' to 'id' which is available from req.params
        if (newRole === 'VOLUNTEER' && !(await Volunteer.findByPk(id))) {
            await Volunteer.create({ userId: id });
        } else if (newRole !== 'VOLUNTEER') {
            await Volunteer.destroy({ where: { userId: id }});
        }

        // --- NOTIFICATION LOGIC ---
        // 4. If the user was promoted to a volunteer, send a welcome notification.
        if (newRole === 'VOLUNTEER' && oldRole !== 'VOLUNTEER') {
            await Notification.create({
                title: 'Welcome to the Volunteer Team!',
                body: 'Your account has been upgraded to a Volunteer role. You can now be assigned to incidents.',
                userId: user.id, // The recipient
            });
        }
        // --- END NOTIFICATION LOGIC ---

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