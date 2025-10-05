import db from "../models/index.js";
import jwt from "jsonwebtoken";
const User = db.User;
const Volunteer = db.Volunteer;

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export const signup = async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      role: req.body.role || 'CITIZEN',
    });

    if (user.role === 'VOLUNTEER') {
      await Volunteer.create({
        userId: user.id,
        isAvailable: true,
      });
    }

    res.status(201).send({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ where: { email: req.body.email } });
    
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = await user.isValidPassword(req.body.password);

    if (!passwordIsValid) {
      return res.status(401).send({ accessToken: null, message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};