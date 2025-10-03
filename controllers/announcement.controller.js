import db from "../models/index.js";
const Announcement = db.Announcement;

// POST /announcements
export const createAnnouncement = async (req, res) => {
    const { title, message, scheduledFor } = req.body;
    try {
        await Announcement.create({
            title,
            message,
            scheduledFor: scheduledFor || null,
            createdById: req.userId
        });
        // Here you would trigger a push notification to all users
        res.status(201).send({ message: "Announcement created successfully." });
    } catch (error) {
        res.status(500).send({ message: error.message });
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