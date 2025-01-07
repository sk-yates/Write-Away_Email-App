const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Email = require('../models/email.js');
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

router.post('/', async (req, res) => {
    try {
        req.body.author = req.user._id;
        const email = await Email.create(req.body);
        email._doc.author = req.user;
        res.status(201).json(email);
      } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
});

module.exports = router;