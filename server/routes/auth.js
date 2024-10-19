const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { companyName, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ companyName, email, password: hashedPassword });
        await newUser.save();

        // Email Verification Logic Here
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, // Your email
                pass: process.env.EMAIL_PASS, // Your email password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Verify your email',
            text: 'Click on the link to verify your email: [verification link]',
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: 'User registered, verification email sent!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add Login Route Here

module.exports = router;
