import db from "../models/index.js";
const Announcement = db.Announcement;
const User = db.User;
const Notification = db.Notification;

// Make sure to import your User and Announcement models
// import User from './models/user';
// import Announcement from './models/announcement';
export const createAnnouncement = async (req, res) => {
    const {
        title,
        message,
        scheduledFor
    } = req.body;
    try {
        const announcement = await Announcement.create({
            title,
            message,
            scheduledFor: scheduledFor || null,
            createdById: req.userId
        });

        const users = await User.findAll({
            attributes: ['id'],
            raw: true
        });

        if (users && users.length > 0) {
            const notifications = users.map(user => ({
                title: `New Announcement: ${title}`,
                body: message,
                userId: user.id,
                // Using a hardcoded ID for testing
                incidentId: "08004717-aa30-4602-88a8-8a4e8c41110c"
            }));

            console.log("Attempting to bulk create these notifications:", notifications);
            
            await Notification.bulkCreate(notifications);

            // This line will only be reached if bulkCreate SUCCEEDS
            console.log("BulkCreate was successful. Notifications created.");
        }

        res.status(201).send({
            message: "Announcement created successfully."
        });

    } catch (error) {
        // --- THIS IS THE CRITICAL PART ---
        // Log the entire error object to see the details
        console.error("!!! AN ERROR OCCURRED in createAnnouncement !!!");
        console.error("Error Name:", error.name); // e.g., SequelizeForeignKeyConstraintError
        console.error("Error Message:", error.message);
        console.error("Full Error Object:", error); // This will show parent error, constraints, etc.
        
        res.status(500).send({
            message: "Failed to create announcement. Check server logs for details.",
            error: error.message // Sending the error message back can be helpful for debugging
        });
    }
};

// GET /announcements
export const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};