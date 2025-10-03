import jwt from "jsonwebtoken";
import db from "../models/index.js";
const User = db.User;

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (user && user.role === 'ADMIN') {
      next();
      return;
    }
    res.status(403).send({ message: "Require Admin Role!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const isVolunteer = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        if (user && (user.role === 'VOLUNTEER' || user.role === 'ADMIN')) {
            next();
            return;
        }
        res.status(403).send({ message: "Require Volunteer or Admin Role!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};