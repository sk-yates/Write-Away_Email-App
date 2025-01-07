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

router.get('/', async (req, res) => {
  try {
    const emails = await Email.find({})
      .populate('author')
      .sort({ createdAt: 'desc' });
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json(emails);
  }
});

router.post('/:emailId/replies', async (req, res) => {
  try {
    req.body.author = req.user._id;
    const email = await Email.findById(req.params.emailId);
    email.replies.push(req.body);
    await email.save();
    
    const newReply = email.replies[email.replies.length - 1];

    
    newReply._doc.author = req.user;


    res.status(201).json(newReply);
  } catch (error) {
    res.status(500).json(error);
  }
});



module.exports = router;