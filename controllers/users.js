const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const SALT_LENGTH = 12;

router.post('/signup', async (req, res) => {
    try {
        const { username, password, role = 'student', createdBy } = req.body;  // Default role to 'student' if not provided
        
        // Validate input
        if (!username || !password || !role) {
            return res.status(400).json({ error: 'Username, password, and role are required.' });
        }

        // Check if the username already exists
        const userInDatabase = await User.findOne({ username });
        if (userInDatabase) {
            return res.status(400).json({ error: 'Username already taken.' });
        }

        // Handle `createdBy` for non-admin users
        let newUserFields = {
            username,
            role,
            hashedPassword: await bcrypt.hash(password, SALT_LENGTH)
        };

        if (role !== "admin") {
            if (!createdBy) {
                return res.status(400).json({ error: 'createdBy field is required for non-admin users.' });
            }
            newUserFields.createdBy = createdBy;
        }

        if (role !== "teacher") {
            if (!assignedTeacher) {
                return res.status(400).json({ error: 'assignedTeacher field is required for student users.' });
            }
            newUserFields.assignedTeacher = assignedTeacher;
        }

        // Create new user
        const user = await User.create(newUserFields);

        // Generate a JWT token
        const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with user and token
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
            const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET);
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: 'Invalid username or password.' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;