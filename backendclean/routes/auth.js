const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check all fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required " });
        }

        // check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists " });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully " });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error " });
    }
});


//LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // check fields
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required " });
        }

        // find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found " });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password " });
        }

        // generate token
        const token = jwt.sign(
            { id: user._id },
            "secretkey",
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful ",
            token,
            user: {
                _id: user._id,
                email: user.email
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error " });
    }
});


// CHANGE PASSWORD
router.put("/change-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // check fields
        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password required " });
        }

        // find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found " });
        }

        // hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update password
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully " });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error updating password " });
    }
});

// DASHBOARD (Protected Route)
router.get("/dashboard", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token " });
        }

        const decoded = require("jsonwebtoken").verify(token, "secretkey");

        res.json({
            message: "Welcome Swati 🎉 "
        });

    } catch (err) {
        res.status(401).json({ message: "Invalid token " });
    }
});
module.exports = router;