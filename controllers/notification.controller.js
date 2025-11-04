import db from "../models/index.js";
const Notification = db.Notification;
const Incident = db.Incident; // Include Incident for deep linking info

// Fetch all notifications for the logged-in user
export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.userId },
            // Order by most recent first
            order: [['createdAt', 'DESC']],
            // Include incident details if the notification is linked to one
            include: [{
                model: Incident,
                attributes: {exclude: []} // Only include necessary fields
            }]
        });

        res.status(200).send(notifications);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Mark a specific notification as read
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            where: {
                id: req.params.id,
                userId: req.userId // Ensure user can only mark their own notifications
            }
        });

        if (!notification) {
            return res.status(404).send({ message: "Notification not found." });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).send({ message: "Notification marked as read." });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};