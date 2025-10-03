import db from "../models/index.js";
const Notification = db.Notification;

export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.userId }, // Get notifications for the logged-in user
            order: [['createdAt', 'DESC']]
        });
        res.status(200).send(notifications);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};