import userModel from '../Models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(409).json({
                message: "User already exists",
                success: false
            });
        }
        const cur = new userModel({ name, email, password });
        cur.password = await bcrypt.hash(password, 10);
        await cur.save();

        res.status(201).json({
            message: "signup success",
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        const errorMessage = "Auth failed : Email or password is wrong";

        if (!user) {
            return res.status(403).json({
                message: errorMessage,
                success: false
            });
        }

        const isPaseq = await bcrypt.compare(password, user.password);
        if (!isPaseq) {
            return res.status(403).json({
                message: errorMessage,
                success: false
            });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Login success",
            success: true,
            jwtToken,
            email,
            name: user.name
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
