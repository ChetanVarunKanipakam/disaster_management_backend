import db from "../models/index.js";
const Setting = db.Setting;

// GET /settings
export const getSettings = async (req, res) => {
    try {
        const settings = await Setting.findAll();
        // Convert array to a key-value object for easier frontend use
        const settingsObj = settings.reduce((obj, item) => {
            obj[item.key] = item.value;
            return obj;
        }, {});
        res.status(200).json(settingsObj);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// PUT /settings
export const updateSettings = async (req, res) => {
    const settingsData = req.body; // e.g., { "notificationRadius": 15000, "severityTypes": [...] }
    try {
        for (const key in settingsData) {
            await Setting.upsert({
                key: key,
                value: settingsData[key]
            });
        }
        res.status(200).send({ message: "Settings updated successfully." });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};