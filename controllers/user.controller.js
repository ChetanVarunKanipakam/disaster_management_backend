import db from "../models/index.js";
const User = db.User;

// Get current user's profile
export const getCurrentUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: { exclude: ['password'] } // Exclude password from response
        });
        if (!user) return res.status(404).send({ message: "User not found."});
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Update current user's profile
export const updateCurrentUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) return res.status(404).send({ message: "User not found."});
        
        await user.update({
            name: req.body.name,
            phone: req.body.phone,
        });

        res.status(200).send({ message: "Profile updated successfully." });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};