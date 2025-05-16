const mongoose = require("mongoose");
const User = require("../../models/schema/User");
const bcrypt = require("bcrypt");
const genrateToken = require("../../utils/generateToken");
const register = async (req, res) => {
    const { email, password, userName, phoneNumber } = req.body;
    console.log(email, password, userName, phoneNumber)
    if (!email || !password || !userName || !phoneNumber) {
        return res.status(400).json({
            success: false,
            message: "Email, password, userName, and phoneNumber are required",
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        console.log(existingUser, 'this is for existing user')
        if (existingUser) {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            return res.status(409).json({
                success: false,
                message: "User with the same email already exists",
            });
        }

        else {

            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword, 'this is for hashed password')
            if (!hashedPassword) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to hash password",
                });
            }

            const user = await User.create({ email, password: hashedPassword, userName, phoneNumber });
            const token = await genrateToken(user);
            console.log(token, 'this is for token REGISTER')
            if (!token) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to generate token'
                })
            }
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });


            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: user,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while registering the user",
        });
    }
};


module.exports = register