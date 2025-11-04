import db from "../models/index.js";
const User = db.User;
import fs from 'fs';
// Get current user's profile
export const getCurrentUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: { exclude: ['password'] } // Exclude password from response
        });
        if (!user) return res.status(404).send({ message: "User not found."});
        console.log(user);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Update current user's profile
export const updateCurrentUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }
        console.log(req.body);
        // Check if a new profile picture was uploaded
        if (req.file) {
            // If the user already has a profile picture, delete the old one
            if (user.profilePictureUrl) {
                fs.unlink(user.profilePictureUrl, (err) => {
                    if (err) console.error("Error deleting old profile picture:", err);
                });
            }
            // Update the user's profile picture URL to the new file's path
            user.profilePictureUrl = req.file.path;
        }

        // Update name and phone from the request body
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;

        await user.save();

        // Respond with the updated user object (without the password)
        res.status(200).send({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profilePictureUrl: user.profilePictureUrl,
            message: "Profile updated successfully.",
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};